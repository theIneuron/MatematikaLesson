# Урок 52 — Действия с векторами · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS51_KONTENT.md`.

Скелет: в переписке 2026-08-21. **Опоры в учебнике 10 класса нет** — векторов в пространстве нет
ни в одном из двух томов 2017 года. Источник истины — план. Блок читается как ПЕРВЫЙ проход.

**Главное решение урока.** Ошибка года `ayirma-tartibi`: разность берут в обратном порядке. На
чертеже это видно как направление стрелки: если оба вектора выпущены из одной точки, то `a − b`
идёт из конца `b` в конец `a`, а не наоборот. Свидетель: перестановка разворачивает стрелку, и все
три числа меняют знак. По длине ошибку не поймать — у `a − b` и `b − a` она одна.

**Числа урока целые намеренно.** `a` равен четыре четыре два, его длина шесть. `b` равен один нуль
два. Сумма пять четыре четыре. Разность три четыре нуль, её длина пять. Удвоенный `a` даёт восемь
восемь четыре, длина двенадцать. Ученик проверяет мысль, а не тренирует корни.

**Запись длины.** В контенте разрешена запись `|a|`: вертикальная черта экранируется обратным
слешем, иначе она рвёт ячейку таблицы. Грабля 2026-08-21, урок 51 из-за неё не поднимался.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины
`vektorlar yig'indisi`, `vektorlar ayirmasi`, `uchburchak qoidasi`, `parallelogramm qoidasi`,
`vektorni songa ko'paytirish`.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ДЕЙСТВИЯ | AMALLAR | OPERATIONS |
| `title` | Куда смотрит разность | Ayirma qayerga qaraydi | Where the difference points |
| `row.a.name` | из конца b в конец a | b oxiridan a oxiriga | from the end of b to the end of a |
| `row.b.name` | из конца a в конец b | a oxiridan b oxiriga | from the end of a to the end of b |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` [верно] | первая | birinchi | the first |
| `probe.b` | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас построим разность. | Javobingiz yozib olindi. Endi ayirmani yasaymiz. | Your answer is recorded. Now we build the difference. |
| `audio.mount` | Два вектора выпущены из одной точки. Ищем их разность, a минус b. | Ikki vektor bir nuqtadan chiqarilgan. Ularning ayirmasini, a minus b ni qidiramiz. | Two vectors are drawn from one point. We look for their difference, a minus b. |
| `audio.r1` | В первой записи стрелка из конца b в конец a. | Birinchi yozuvda strelka b oxiridan a oxiriga. | In the first reading the arrow is from the end of b to the end of a. |
| `audio.r2` | Во второй наоборот. | Ikkinchisida teskarisiga. | In the second it is the other way. |
| `audio.ask` | Обе стрелки лежат на одной прямой, и на глаз они одинаковые. Как думаешь, какая запись верная? | Ikki strelka ham bir to'g'ri chiziqda yotadi, va ko'z bilan ular bir xil. Sizningcha qaysi yozuv to'g'ri? | Both arrows lie on one line, and by eye they look the same. Which reading do you think is right? |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a (4; 4; 2),   b (1; 0; 2)` |
| `row.a.value` | `(3; 4; 0)` |
| `row.b.value` | `(−3; −4; 0)` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса из курса | Kursdan uch savol | Three questions from the course |
| `q1.prompt` | Как складывают векторы по правилу треугольника? | Uchburchak qoidasi bo'yicha vektorlar qanday qo'shiladi? | How are vectors added by the triangle rule? |
| `q1.a` [верно] | начало второго ставят в конец первого | ikkinchisining boshi birinchisining oxiriga qo'yiladi | the start of the second is placed at the end of the first |
| `q1.b` | оба ставят из одной точки | ikkisi ham bir nuqtadan qo'yiladi | both are placed from one point |
| `q1.b.hint` | Из одной точки это правило параллелограмма. | Bir nuqtadan bu parallelogramm qoidasi. | From one point that is the parallelogram rule. |
| `q1.c` | складывают их длины | uzunliklari qo'shiladi | their lengths are added |
| `q1.c.hint` | Длины складываются только у сонаправленных. | Uzunliklar faqat bir yo'nalishdagilarda qo'shiladi. | Lengths add only for vectors of the same direction. |
| `q1.d` | берут наибольший из двух | ikkitasidan kattasi olinadi | the larger of the two is taken |
| `q1.d.hint` | Сумма не выбирает между слагаемыми. | Yig'indi qo'shiluvchilar orasidan tanlamaydi. | A sum does not choose between the terms. |
| `q2.prompt` | Что делает умножение на два? | Ikkiga ko'paytirish nima qiladi? | What does multiplying by two do? |
| `q2.a` [верно] | удлиняет вдвое, направление то же | ikki barobar uzaytiradi, yo'nalish o'sha | doubles the length, the direction is the same |
| `q2.b` | поворачивает вектор | vektorni buradi | turns the vector |
| `q2.b.hint` | Поворота при умножении на число нет. | Songa ko'paytirishda burilish yo'q. | There is no turn when multiplying by a number. |
| `q2.c` | меняет только первое число | faqat birinchi sonni o'zgartiradi | changes only the first number |
| `q2.c.hint` | Множитель проходит по всем трём числам. | Ko'paytuvchi uch sonning hammasiga o'tadi. | The factor goes through all three numbers. |
| `q2.d` | удлиняет вдвое и разворачивает | ikki barobar uzaytiradi va teskari buradi | doubles the length and reverses it |
| `q2.d.hint` | Разворачивает отрицательный множитель. | Manfiy ko'paytuvchi teskari buradi. | A negative factor reverses it. |
| `q3.prompt` | Чему равна сумма вектора и противоположного? | Vektor va qarama-qarshining yig'indisi nimaga teng? | What does a vector plus its opposite equal? |
| `q3.a` [верно] | нулевому вектору | nol vektorga | the zero vector |
| `q3.b` | удвоенному вектору | ikkilangan vektorga | the doubled vector |
| `q3.b.hint` | Удвоение выйдет при сложении с самим собой. | Ikkilanish o'zi bilan qo'shganda chiqadi. | Doubling comes from adding it to itself. |
| `q3.c` | вектору той же длины | o'sha uzunlikdagi vektorga | a vector of the same length |
| `q3.c.hint` | Длина результата ноль, а не та же. | Natijaning uzunligi nol, o'sha emas. | The length of the result is zero, not the same. |
| `q3.d` | ничему, так складывать нельзя | hech nimaga, bunday qo'shib bo'lmaydi | nothing, such an addition is not allowed |
| `q3.d.hint` | Складывать можно любые два вектора. | Ixtiyoriy ikki vektorni qo'shish mumkin. | Any two vectors may be added. |
| `audio.mount` | Три вопроса. Правило урока соберётся из первого и второго. | Uchta savol. Darsning qoidasi birinchi va ikkinchidan yig'iladi. | Three questions. The rule of the lesson will be assembled from the first and the second. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `a + b` |
| `q2.done` | `2a` |
| `q3.done` | `a + (−a) = 0` |

---

## Экран 3 · `explain1` · ответ `number` · тег `ayirma-tartibi`

Сумма: по каждой оси отдельно.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Складываем по осям | O'qlar bo'yicha qo'shamiz | We add along the axes |
| `show.1.1` | вектор a и вектор b | a vektori va b vektori | the vector a and the vector b |
| `show.1.2` | начало b поставили в конец a | b boshi a oxiriga qo'yildi | the start of b was placed at the end of a |
| `show.2.1` | стрелка от начала a до конца b | a boshidan b oxirigacha strelka | an arrow from the start of a to the end of b |
| `show.2.2` | это сумма, пять четыре четыре | bu yig'indi, besh to'rt to'rt | this is the sum, five four four |
| `audio.mount` | Два вектора, и второй я поставил началом в конец первого. | Ikki vektor, va ikkinchisining boshini birinchisining oxiriga qo'ydim. | Two vectors, and I placed the start of the second at the end of the first. |
| `audio.move*` | Замыкающая стрелка идёт от начала первого до конца второго, и это сумма. В координатах всё проще, чем на чертеже: складывать надо по каждой оси отдельно. Четыре плюс один даёт пять, четыре плюс нуль даёт четыре, два плюс два даёт четыре. Сумма пять четыре четыре. Почему по осям можно складывать независимо: каждый вектор это сдвиг, а два сдвига подряд по одной оси просто складываются, и другие оси на это не влияют. Обрати внимание, что от порядка сумма не зависит: поставь сначала b, потом a, и замыкающая стрелка придёт в ту же точку. | Yopuvchi strelka birinchisining boshidan ikkinchisining oxirigacha boradi, va bu yig'indi. Koordinatalarda hammasi chizmadagidan oddiy: har o'q bo'yicha alohida qo'shish kerak. To'rt qo'shuv bir besh beradi, to'rt qo'shuv nol to'rt beradi, ikki qo'shuv ikki to'rt beradi. Yig'indi besh to'rt to'rt. O'qlar bo'yicha mustaqil qo'shish nega mumkin: har vektor siljish, va bir o'q bo'yicha ketma-ket ikki siljish shunchaki qo'shiladi, boshqa o'qlar bunga ta'sir qilmaydi. E'tibor bering, yig'indi tartibga bog'liq emas: avval b ni, keyin a ni qo'ying, va yopuvchi strelka o'sha nuqtaga keladi. | The closing arrow goes from the start of the first to the end of the second, and that is the sum. In coordinates everything is simpler than on the drawing: you add along each axis separately. Four plus one gives five, four plus zero gives four, two plus two gives four. The sum is five four four. Why the axes may be added independently: every vector is a shift, and two shifts in a row along one axis simply add up, and the other axes do not affect it. Note that the sum does not depend on the order: place b first and a second, and the closing arrow arrives at the same point. |
| `audio.work` | Посчитай сам. Какое второе число у суммы? | O'zingiz hisoblang. Yig'indining ikkinchi soni qanday? | Work it out yourself. What is the second number of the sum? |
| `work.prompt` | Второе число суммы? | Yig'indining ikkinchi soni? | The second number of the sum? |
| `work.ok` | Четыре. Четыре плюс нуль. | To'rt. To'rt qo'shuv nol. | Four. Four plus zero. |
| `work.hint.1` | Складывай по второй оси. | Ikkinchi o'q bo'yicha qo'shing. | Add along the second axis. |
| `work.hint.2` | У b там нуль. | b da u yerda nol. | b has zero there. |
| `work.hint.3` | Четыре. | To'rt. | Four. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a + b = (5; 4; 4)` |
| `work.answer` | `4` |

---

## Экран 4 · `explain2` · ответ `number` · тег `ayirma-tartibi`

Два правила, один ответ.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Два правила, один ответ | Ikki qoida, bitta javob | Two rules, one answer |
| `show.1.1` | правило треугольника | uchburchak qoidasi | the triangle rule |
| `show.1.2` | сумма пять четыре четыре | yig'indi besh to'rt to'rt | the sum is five four four |
| `show.2.1` | правило параллелограмма | parallelogramm qoidasi | the parallelogram rule |
| `show.2.2` | сумма та же самая | yig'indi o'sha | the sum is the same |
| `audio.mount` | Соберу ту же сумму вторым способом: оба вектора из одной точки. | O'sha yig'indini ikkinchi usul bilan yig'aman: ikki vektor ham bir nuqtadan. | Let me collect the same sum in the second way: both vectors from one point. |
| `audio.move*` | Достраиваю параллелограмм, и сумма это его диагональ из общего начала. Тройка получилась та же, пять четыре четыре, и это не совпадение: параллелограмм и треугольник это один и тот же чертёж, только во втором случае второй вектор перенесён. А перенос вектора его не меняет, это правило прошлого урока. Значит выбор правила это выбор удобства, а не выбор ответа. Треугольник удобнее, когда векторов много и они идут цепочкой. Параллелограмм удобнее, когда оба выпущены из одной точки, и именно он понадобится для разности. | Parallelogrammni to'ldiraman, va yig'indi uning umumiy boshdan chiqqan diagonali. Uchlik o'sha chiqdi, besh to'rt to'rt, va bu tasodif emas: parallelogramm va uchburchak bir xil chizma, faqat ikkinchi holda ikkinchi vektor ko'chirilgan. Vektorni ko'chirish esa uni o'zgartirmaydi, bu o'tgan darsning qoidasi. Demak qoidani tanlash qulaylikni tanlash, javobni tanlash emas. Vektorlar ko'p bo'lib zanjir bo'lib ketsa, uchburchak qulayroq. Ikkisi ham bir nuqtadan chiqarilgan bo'lsa, parallelogramm qulayroq, va ayirma uchun aynan u kerak bo'ladi. | I complete the parallelogram, and the sum is its diagonal from the common start. The triple came out the same, five four four, and that is no coincidence: the parallelogram and the triangle are one and the same drawing, only in the second case the second vector has been shifted. And shifting a vector does not change it, that is the rule of the previous lesson. So the choice of rule is a choice of convenience, not a choice of answer. The triangle is handier when there are many vectors going in a chain. The parallelogram is handier when both are drawn from one point, and it is exactly the one needed for the difference. |
| `audio.work` | Посчитай сам. Сколько разных ответов дают два правила? | O'zingiz hisoblang. Ikki qoida nechta xil javob beradi? | Work it out yourself. How many different answers do the two rules give? |
| `work.prompt` | Сколько разных ответов? | Nechta xil javob? | How many different answers? |
| `work.ok` | Один. Правила разные, сумма одна. | Bitta. Qoidalar boshqa, yig'indi bitta. | One. The rules differ, the sum is one. |
| `work.hint.1` | Сравни тройки, а не чертежи. | Uchliklarni taqqoslang, chizmalarni emas. | Compare the triples, not the drawings. |
| `work.hint.2` | Обе дали пять четыре четыре. | Ikkisi ham besh to'rt to'rt berdi. | Both gave five four four. |
| `work.hint.3` | Один. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a + b = b + a` |
| `work.answer` | `1` |

---

## Экран 5 · `explain3` · ответ `number` · тег `ayirma-tartibi`

Разность: сумма с противоположным.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Разность это сумма с противоположным | Ayirma qarama-qarshi bilan yig'indi | A difference is a sum with the opposite |
| `show.1.1` | развернули вектор b | b vektori teskari burildi | the vector b was reversed |
| `show.1.2` | и прибавили к a | va a ga qo'shildi | and added to a |
| `show.2.1` | стрелка из конца b в конец a | b oxiridan a oxiriga strelka | an arrow from the end of b to the end of a |
| `show.2.2` | разность три четыре нуль | ayirma uch to'rt nol | the difference is three four zero |
| `audio.mount` | Разность не новое действие. Разворачиваю b и складываю с a. | Ayirma yangi amal emas. b ni teskari buraman va a bilan qo'shaman. | A difference is not a new operation. I reverse b and add it to a. |
| `audio.move*` | В координатах это вычитание по каждой оси: четыре минус один даёт три, четыре минус нуль даёт четыре, два минус два даёт нуль. Разность три четыре нуль. А на чертеже она видна иначе, и это самое полезное место урока. Если оба вектора выпущены из одной точки, разность a минус b это стрелка из конца b в конец a. Проверить легко: пройди от конца b в конец a, и ты действительно вернёшься по b назад, а потом пройдёшь по a. Порядок здесь решает всё. Переставь буквы, и стрелка развернётся, а все три числа сменят знак. Длина при этом не изменится, и потому по длине ошибку в порядке не поймать. | Koordinatalarda bu har o'q bo'yicha ayirish: to'rt minus bir uch beradi, to'rt minus nol to'rt beradi, ikki minus ikki nol beradi. Ayirma uch to'rt nol. Chizmada esa u boshqacha ko'rinadi, va bu darsning eng foydali joyi. Ikki vektor ham bir nuqtadan chiqarilgan bo'lsa, a minus b ayirmasi b oxiridan a oxiriga strelka. Tekshirish oson: b oxiridan a oxiriga yuring, va siz haqiqatan b bo'ylab orqaga qaytasiz, keyin a bo'ylab yurasiz. Tartib bu yerda hammasini hal qiladi. Harflarni almashtiring, va strelka teskari buriladi, uch son esa ishorani o'zgartiradi. Uzunlik esa o'zgarmaydi, shuning uchun tartibdagi xatoni uzunlik bilan ushlab bo'lmaydi. | In coordinates that is a subtraction along each axis: four minus one gives three, four minus zero gives four, two minus two gives zero. The difference is three four zero. On the drawing it is seen differently, and that is the most useful place in the lesson. If both vectors are drawn from one point, the difference a minus b is the arrow from the end of b to the end of a. It is easy to check: walk from the end of b to the end of a, and you really do go back along b and then forward along a. The order decides everything here. Swap the letters and the arrow reverses while all three numbers change sign. The length does not change, and that is why a mistake in the order cannot be caught by the length. |
| `audio.work` | Посчитай сам. Какое первое число у разности a минус b? | O'zingiz hisoblang. a minus b ayirmasining birinchi soni qanday? | Work it out yourself. What is the first number of the difference a minus b? |
| `work.prompt` | Первое число разности? | Ayirmaning birinchi soni? | The first number of the difference? |
| `work.ok` | Три. Четыре минус один. | Uch. To'rt minus bir. | Three. Four minus one. |
| `work.hint.1` | Вычитай по первой оси. | Birinchi o'q bo'yicha ayiring. | Subtract along the first axis. |
| `work.hint.2` | У a там четыре, у b один. | a da u yerda to'rt, b da bir. | a has four there, b has one. |
| `work.hint.3` | Три. | Uch. | Three. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a − b = a + (−b)` |
| `work.answer` | `3` |

---

## Экран 6 · `explain4` · ответ `number` · тег `ayirma-tartibi`

Умножение на число: длина растёт, направление держится.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Множитель проходит по всем осям | Ko'paytuvchi barcha o'qlarga o'tadi | The factor goes through all the axes |
| `show.1.1` | вектор a длиной шесть | uzunligi olti bo'lgan a vektori | the vector a of length six |
| `show.1.2` | умножаем на два | ikkiga ko'paytiramiz | we multiply by two |
| `show.2.1` | каждое число удвоилось | har son ikkilandi | every number doubled |
| `show.2.2` | длина стала двенадцать | uzunlik o'n ikki bo'ldi | the length became twelve |
| `audio.mount` | Возьмём вектор a и умножим его на два. | a vektorini olib, ikkiga ko'paytiramiz. | Take the vector a and multiply it by two. |
| `audio.move*` | Множитель проходит по всем трём числам сразу, и это видно на чертеже: стрелка вытянулась вдвое, а направление осталось прежним. Длина тоже удвоилась, и её не надо считать заново: если каждое число выросло вдвое, то каждый квадрат вырос вчетверо, а корень из вчетверо большего числа ровно вдвое больше. Отсюда общее правило: длина умножается на модуль множителя. Слово модуль тут важно, потому что при отрицательном множителе длина всё равно растёт, а разворачивается только направление. И особый случай: умножение на нуль даёт нулевой вектор, у которого направления нет вовсе. | Ko'paytuvchi uch sonning hammasiga birdan o'tadi, va bu chizmada ko'rinadi: strelka ikki barobar uzaydi, yo'nalish esa avvalgi bo'lib qoldi. Uzunlik ham ikkilandi, va uni qaytadan hisoblash kerak emas: har son ikki barobar o'ssa, har kvadrat to'rt barobar o'sadi, to'rt barobar katta sondan ildiz esa roppa-rosa ikki barobar katta. Shundan umumiy qoida: uzunlik ko'paytuvchining moduliga ko'paytiriladi. Modul so'zi bu yerda muhim, chunki manfiy ko'paytuvchida ham uzunlik o'sadi, faqat yo'nalish teskari buriladi. Va maxsus hol: nolga ko'paytirish nol vektorni beradi, unda yo'nalish umuman yo'q. | The factor goes through all three numbers at once, and that is visible on the drawing: the arrow stretched twice while the direction stayed the same. The length doubled too, and there is no need to compute it anew: if every number grew twice, every square grew four times, and the root of a four times larger number is exactly twice as large. Hence the general rule: the length is multiplied by the modulus of the factor. The word modulus matters here, because with a negative factor the length still grows and only the direction reverses. And a special case: multiplying by zero gives the zero vector, which has no direction at all. |
| `audio.work` | Посчитай сам. Какова длина удвоенного вектора a? | O'zingiz hisoblang. Ikkilangan a vektorining uzunligi qancha? | Work it out yourself. What is the length of the doubled vector a? |
| `work.prompt` | Длина удвоенного a? | Ikkilangan a ning uzunligi? | The length of the doubled a? |
| `work.ok` | Двенадцать. Шесть на два. | O'n ikki. Olti karra ikki. | Twelve. Six times two. |
| `work.hint.1` | Длина a равна шести. | a ning uzunligi oltiga teng. | The length of a equals six. |
| `work.hint.2` | Множитель проходит и в длину. | Ko'paytuvchi uzunlikka ham o'tadi. | The factor passes into the length as well. |
| `work.hint.3` | Двенадцать. | O'n ikki. | Twelve. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `2a = (8; 8; 4)` |
| `work.answer` | `12` |

---

## Экран 7 · `explain5` · ответ `number` · тег `ayirma-tartibi`

ГРАНИЦА: нулевой вектор.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE EDGE CASE |
| `title` | Когда результат исчезает | Natija qachon yo'qoladi | When the result disappears |
| `show.1.1` | вектор a и противоположный | a vektori va qarama-qarshisi | the vector a and its opposite |
| `show.1.2` | ставим их цепочкой | ularni zanjir qilib qo'yamiz | we place them in a chain |
| `show.2.1` | замыкающая стрелка пропала | yopuvchi strelka yo'qoldi | the closing arrow vanished |
| `show.2.2` | конец вернулся в начало | oxir boshiga qaytdi | the end returned to the start |
| `audio.mount` | Поставлю вектор a, а за ним противоположный, началом в конец. | a vektorini, uning ketidan qarama-qarshisini boshini oxiriga qo'yib qo'yaman. | Let me place the vector a and after it its opposite, start at the end. |
| `audio.move*` | Второй вектор вернул нас точно туда, откуда мы вышли, и замыкающей стрелки не осталось. В координатах то же самое: каждое число сложилось со своим отрицательным и дало нуль. Получился нулевой вектор. Он особый: длина у него нуль, а направления нет совсем, и это не небрежность записи, а свойство. Поэтому нулевой вектор нельзя нарисовать стрелкой и нельзя спросить, куда он смотрит. Зато он ведёт себя как нуль в арифметике: прибавь его к любому вектору, и тот не изменится. И ещё: если в задаче вышел нулевой вектор, это часто и есть ответ, а не признак ошибки. | Ikkinchi vektor bizni aynan chiqqan joyimizga qaytardi, va yopuvchi strelka qolmadi. Koordinatalarda ham xuddi shunday: har son o'zining manfiysi bilan qo'shilib nol berdi. Nol vektor chiqdi. U maxsus: uzunligi nol, yo'nalishi esa umuman yo'q, va bu yozuvdagi e'tiborsizlik emas, xossa. Shuning uchun nol vektorni strelka bilan chizib bo'lmaydi va u qayerga qaraydi deb so'rab bo'lmaydi. Buning o'rniga u arifmetikadagi nol kabi tutadi: uni ixtiyoriy vektorga qo'shing, va u o'zgarmaydi. Va yana: masalada nol vektor chiqsa, bu ko'pincha javobning o'zi, xatoning alomati emas. | The second vector brought us exactly back to where we started, and no closing arrow was left. In coordinates the same thing: every number added to its negative and gave zero. The zero vector appeared. It is special: its length is zero and it has no direction at all, and that is not sloppy notation but a property. That is why the zero vector cannot be drawn as an arrow and cannot be asked where it points. On the other hand it behaves like zero in arithmetic: add it to any vector and that vector does not change. And one more thing: if a problem yields the zero vector, that is often the answer itself and not a sign of a mistake. |
| `audio.work` | Посчитай сам. Какова длина этой суммы? | O'zingiz hisoblang. Bu yig'indining uzunligi qancha? | Work it out yourself. What is the length of this sum? |
| `work.prompt` | Длина суммы? | Yig'indining uzunligi? | The length of the sum? |
| `work.ok` | Ноль. Это нулевой вектор. | Nol. Bu nol vektor. | Zero. It is the zero vector. |
| `work.hint.1` | Сложи каждое число со своим отрицательным. | Har sonni o'zining manfiysi bilan qo'shing. | Add every number to its negative. |
| `work.hint.2` | Все три дали нуль. | Uchtasi ham nol berdi. | All three gave zero. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a + (−a) = 0` |
| `work.answer` | `0` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `ayirma-tartibi`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Три действия | Uch amal | Three operations |
| `probe.question` | Куда идёт разность a минус b? | a minus b ayirmasi qayerga boradi? | Where does the difference a minus b go? |
| `probe.a` [верно] | из конца b в конец a | b oxiridan a oxiriga | from the end of b to the end of a |
| `probe.b` | из конца a в конец b | a oxiridan b oxiriga | from the end of a to the end of b |
| `probe.b.hint` | Так выйдет b минус a, у неё все знаки обратные. | Bunda b minus a chiqadi, unda barcha ishoralar teskari. | That gives b minus a, whose signs are all reversed. |
| `rule.lawLabel` | Действия по осям | O'qlar bo'yicha amallar | Operations along the axes |
| `rule.lines.1` | сумма и разность считаются по каждой оси отдельно | yig'indi va ayirma har o'q bo'yicha alohida hisoblanadi | the sum and the difference are computed along each axis separately |
| `rule.lines.2` | разность a минус b идёт из конца b в конец a | a minus b ayirmasi b oxiridan a oxiriga boradi | the difference a minus b goes from the end of b to the end of a |
| `rule.lines.3` | множитель проходит по всем числам, длина берёт его модуль | ko'paytuvchi barcha sonlarga o'tadi, uzunlik uning modulini oladi | the factor goes through all the numbers, the length takes its modulus |
| `audio.mount` | Один вопрос на различение, потом карточка. | Farqlashga bitta savol, keyin kartochka. | One question to tell them apart, then the card. |
| `audio.rule*` | Первая строка снимает почти все трудности: действия идут по осям, и никакой геометрии для счёта не нужно. Вторая строка нужна там, где чертёж уже дан и надо прочитать по нему разность, и это ровно то место, где теряют порядок. Третья строка про множитель, и в ней важно слово модуль: длина от знака не зависит. А самая полезная привычка такая. Прежде чем считать разность, назови вслух, из какого конца в какой ты идёшь. Если сказать не получается, значит порядок ещё не выбран, и считать рано. | Birinchi satr deyarli barcha qiyinchilikni oladi: amallar o'qlar bo'yicha boradi, va hisob uchun hech qanday geometriya kerak emas. Ikkinchi satr chizma allaqachon berilgan va ayirmani undan o'qish kerak bo'lgan joyda kerak, va bu aynan tartib yo'qoladigan joy. Uchinchi satr ko'paytuvchi haqida, va unda modul so'zi muhim: uzunlik ishoraga bog'liq emas. Eng foydali odat esa bunday. Ayirmani hisoblashdan oldin qaysi oxirdan qaysi oxirga borayotganingizni ovoz chiqarib ayting. Aytolmasangiz, demak tartib hali tanlanmagan, va hisoblash erta. | The first line removes almost all the difficulty: the operations go along the axes, and no geometry is needed for the counting. The second line is needed where the drawing is already given and the difference has to be read off it, and that is exactly where the order gets lost. The third line is about the factor, and the word modulus matters in it: the length does not depend on the sign. And the most useful habit is this. Before computing a difference, say aloud which end you are going from and to. If you cannot say it, the order has not been chosen yet and it is too early to compute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `a − b = a + (−b)` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `ayirma-tartibi`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | AMALIYOT | PRACTICE |
| `title` | Действие и результат | Amal va natija | The operation and the result |
| `match.prompt` | Соедини тройку с действием | Uchlikni amal bilan birlashtiring | Match the triple with the operation |
| `match.ok` | Все четыре на месте. Каждое действие идёт по осям. | To'rttasi ham joyida. Har amal o'qlar bo'yicha boradi. | All four in place. Every operation goes along the axes. |
| `audio.mount` | Четыре тройки и четыре действия. Считай по осям. | To'rt uchlik va to'rt amal. O'qlar bo'yicha hisoblang. | Four triples and four operations. Count along the axes. |
| `match.a` | сумма a и b | a va b yig'indisi | the sum of a and b |
| `match.b` | разность a минус b | a minus b ayirmasi | the difference a minus b |
| `match.c` | удвоенный a | ikkilangan a | the doubled a |
| `match.d` | противоположный b | qarama-qarshi b | the opposite of b |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `(5; 4; 4)` · `(3; 4; 0)` · `(8; 8; 4)` · `(−1; 0; −2)` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `ayirma-tartibi`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Докажи правило треугольника | Uchburchak qoidasini isbotlang | Prove the triangle rule |
| `proof.given` | три точки, два вектора цепочкой | uch nuqta, zanjir bo'lgan ikki vektor | three points, two vectors in a chain |
| `proof.goal` | сумма даёт вектор из первой точки в третью | yig'indi birinchi nuqtadan uchinchisiga vektor beradi | the sum gives the vector from the first point to the third |
| `proof.r1` | первый вектор это вторая точка минус первая | birinchi vektor ikkinchi nuqta minus birinchisi | the first vector is the second point minus the first |
| `proof.r2` | второй вектор это третья точка минус вторая | ikkinchi vektor uchinchi nuqta minus ikkinchisi | the second vector is the third point minus the second |
| `proof.r3` | в сумме вторая точка сократилась | yig'indida ikkinchi nuqta qisqardi | in the sum the second point cancelled |
| `proof.ok` | Доказано. Правило треугольника это сокращение средней точки. | Isbotlandi. Uchburchak qoidasi o'rtadagi nuqtaning qisqarishi. | Proved. The triangle rule is the cancelling of the middle point. |
| `proof.e1` | Про второй вектор дальше. Сначала первый. | Ikkinchi vektor haqida keyin. Avval birinchisi. | The second vector comes later. First the first one. |
| `proof.e2` | Первый записан. Теперь второй. | Birinchisi yozildi. Endi ikkinchisi. | The first is written. Now the second. |
| `proof.e3` | Оба записаны. Что происходит при сложении. | Ikkisi ham yozildi. Qo'shganda nima bo'ladi. | Both are written. What happens when they are added. |
| `reason.s1` | тройка вектора это конец минус начало | vektorning uchligi oxir minus boshi | the triple of a vector is the end minus the start |
| `reason.s2` | то же правило для второй пары | ikkinchi juft uchun o'sha qoida | the same rule for the second pair |
| `reason.s3` | сложение идёт по каждой оси | qo'shish har o'q bo'yicha boradi | the addition goes along each axis |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование. Он показывает один ракурс из многих. | Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification. It shows one view out of many. |
| `audio.mount` | Три строки, и у каждой своё обоснование из списка. | Uch qator, va har birining ro'yxatdan o'z asoslashi bor. | Three lines, each with its own justification from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AB + BC = AC` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO TOOL |
| `title` | Счёт и порядок | Hisob va tartib | Counting and order |
| `task.ok` | Пять. Три и четыре дают пять. | Besh. Uch va to'rt besh beradi. | Five. Three and four give five. |
| `task.hint.1` | Сначала найди тройку разности. | Avval ayirmaning uchligini toping. | First find the triple of the difference. |
| `task.hint.2` | Три четыре нуль. | Uch to'rt nol. | Three four zero. |
| `task.hint.3` | Девять плюс шестнадцать. | To'qqiz qo'shuv o'n olti. | Nine plus sixteen. |
| `order.prompt` | Расставь шаги в том порядке, в каком считают | Qadamlarni hisoblash tartibida joylashtiring | Arrange the steps in the order they are computed |
| `order.title` | Порядок счёта | Hisob tartibi | The order of computing |
| `order.ok` | Порядок верный. Развернуть, сложить, квадраты, корень. | Tartib to'g'ri. Teskari burish, qo'shish, kvadratlar, ildiz. | The order is right. Reverse, add, squares, root. |
| `order.bad` | Не в этом порядке. Что нужно раньше. | Bu tartibda emas. Avval nima kerak. | Not in this order. What is needed first. |
| `audio.mount` | Прибор убран. Считаем на бумаге. | Asbob olib qo'yildi. Qog'ozda hisoblaymiz. | The tool is put away. We count on paper. |
| `audio.next` | Теперь порядок шагов. Расставь их так, как считают. | Endi qadamlar tartibi. Ularni qanday hisoblansa, shunday joylashtiring. | Now the order of the steps. Arrange them the way the counting goes. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `a (4; 4; 2),   b (1; 0; 2),   \|a − b\| = ?` |
| `task.answer` | `5` |
| `order.items` | `\|a − b\|` · `−b` · `x² + y² + z²` · `a + (−b)` |
| `order.answer` | `−b  a + (−b)  x² + y² + z²  \|a − b\|` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xato qatorni toping | Find the line with the mistake |
| `hint.r1` | Данные выписаны верно. | Berilganlar to'g'ri yozilgan. | The data are written correctly. |
| `hint.r2` | Правило записано верно. | Qoida to'g'ri yozilgan. | The rule is written correctly. |
| `hint.r4` | Строка получена из неверной строки выше. | Qator yuqoridagi xato qatordan olingan. | The line comes from the wrong line above. |
| `proof` | Поверни сцену: стрелка идёт из конца b в конец a, и поворот этого не меняет. | Sahnani buring: strelka b oxiridan a oxiriga boradi, va burilish buni o'zgartirmaydi. | Rotate the scene: the arrow goes from the end of b to the end of a, and rotation does not change it. |
| `entry.prompt` | Номер строки с ошибкой | Xato qator raqami | The number of the line with the mistake |
| `entry.ok` | Третья. Вычли в обратном порядке. | Uchinchi. Teskari tartibda ayirilgan. | The third. The subtraction was done in the reverse order. |
| `entry.hint.1` | Проверь, из какого вектора вычитали. | Qaysi vektordan ayirilganini tekshiring. | Check which vector was subtracted from. |
| `entry.hint.2` | Первая буква в записи это то, из чего вычитают. | Yozuvdagi birinchi harf ayiriladigan narsa. | The first letter in the notation is what you subtract from. |
| `entry.hint.3` | Ошибка в третьей строке. | Xato uchinchi qatorda. | The mistake is in the third line. |
| `audio.mount` | Четыре строки, и одна из них меняет порядок вычитания. | To'rt qator, va ulardan biri ayirish tartibini o'zgartiradi. | Four lines, and one of them changes the order of subtraction. |
| `audio.next` | Теперь напиши номер строки, в которой ошибка. | Endi xato bo'lgan qator raqamini yozing. | Now write the number of the line with the mistake. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `a (4; 4; 2),   b (1; 0; 2)` |
| `row.r2` | `a − b = a + (−b)` |
| `row.r3` | `a − b = (−3; −4; 0)` |
| `row.r4` | `b − a = (3; 4; 0)` |
| `answerId` | `r3` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | В обратную сторону | Teskari tomonga | The other way round |
| `place.prompt` | Известны вектор a и сумма a плюс b. Каково третье число вектора b? | a vektori va a qo'shuv b yig'indisi ma'lum. b vektorining uchinchi soni qanday? | The vector a and the sum a plus b are known. What is the third number of the vector b? |
| `place.ok` | Два. Четыре минус два. | Ikki. To'rt minus ikki. | Two. Four minus two. |
| `place.wrong` | Из суммы вычитают известное слагаемое, а не наоборот. | Yig'indidan ma'lum qo'shiluvchi ayiriladi, teskarisi emas. | The known term is subtracted from the sum, not the other way. |
| `multi.prompt` | Отметь все верные записи | Barcha to'g'ri yozuvlarni belgilang | Mark all the correct readings |
| `multi.title` | Что верно для этих векторов | Bu vektorlar uchun nima to'g'ri | What is true for these vectors |
| `multi.d.hint` | Это разность в обратном порядке. | Bu teskari tartibdagi ayirma. | That is the difference in the reverse order. |
| `multi.e.hint` | Множитель проходит по всем трём числам. | Ko'paytuvchi uch sonning hammasiga o'tadi. | The factor goes through all three numbers. |
| `multi.ok` | Три записи из пяти. Две оставшиеся путают порядок и множитель. | Beshtadan uch yozuv. Qolgan ikkitasi tartib va ko'paytuvchini aralashtiradi. | Three readings out of five. The other two confuse the order and the factor. |
| `audio.mount` | Прочитаем урок справа налево. Дана сумма, найти надо слагаемое. | Darsni o'ngdan chapga o'qiymiz. Yig'indi berilgan, qo'shiluvchini topish kerak. | Let us read the lesson from right to left. The sum is given, a term is to be found. |
| `audio.work` | Отметь все записи, которые верны. Их больше одной. | To'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p. | Mark all the readings that are correct. There is more than one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `2` |
| `place.step` | `4 − 2` |
| `multi.a` [верно] | `b = (1; 0; 2)` |
| `multi.b` [верно] | `a − b = (3; 4; 0)` |
| `multi.c` [верно] | `2a = (8; 8; 4)` |
| `multi.d` | `a − b = (−3; −4; 0)` |
| `multi.e` | `2a = (8; 4; 2)` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `ayirma-tartibi`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Как считают сумму по координатам? | Yig'indi koordinatalar bo'yicha qanday hisoblanadi? | How is a sum computed in coordinates? |
| `q1.a` [верно] | по каждой оси отдельно | har o'q bo'yicha alohida | along each axis separately |
| `q1.b` | складывают длины | uzunliklar qo'shiladi | the lengths are added |
| `q1.b.hint` | Длины складываются только у сонаправленных. | Uzunliklar faqat bir yo'nalishdagilarda qo'shiladi. | Lengths add only for vectors of the same direction. |
| `q1.c` | берут наибольшие числа | eng katta sonlar olinadi | the largest numbers are taken |
| `q1.c.hint` | Сумма не выбирает между числами. | Yig'indi sonlar orasidan tanlamaydi. | A sum does not choose between numbers. |
| `q1.d` | умножают по осям | o'qlar bo'yicha ko'paytiriladi | they are multiplied along the axes |
| `q1.d.hint` | Умножение это другое действие. | Ko'paytirish boshqa amal. | Multiplication is another operation. |
| `q2.prompt` | Куда идёт разность a минус b? | a minus b ayirmasi qayerga boradi? | Where does the difference a minus b go? |
| `q2.a` [верно] | из конца b в конец a | b oxiridan a oxiriga | from the end of b to the end of a |
| `q2.b` | из конца a в конец b | a oxiridan b oxiriga | from the end of a to the end of b |
| `q2.b.hint` | Так выйдет b минус a. | Bunda b minus a chiqadi. | That gives b minus a. |
| `q2.c` | из общего начала | umumiy boshdan | from the common start |
| `q2.c.hint` | Из общего начала идёт сумма. | Umumiy boshdan yig'indi boradi. | The sum goes from the common start. |
| `q2.d` | по диагонали параллелограмма | parallelogramm diagonali bo'ylab | along the diagonal of the parallelogram |
| `q2.d.hint` | Эта диагональ и есть сумма. | Bu diagonal yig'indining o'zi. | That diagonal is the sum itself. |
| `q3.prompt` | Что даёт умножение на минус один? | Minus birga ko'paytirish nima beradi? | What does multiplying by minus one give? |
| `q3.a` [верно] | тот же по длине, обратный по направлению | uzunligi o'sha, yo'nalishi teskari | the same in length, reverse in direction |
| `q3.b` | нулевой вектор | nol vektor | the zero vector |
| `q3.b.hint` | Нулевой даёт умножение на нуль. | Nolni nolga ko'paytirish beradi. | The zero vector comes from multiplying by zero. |
| `q3.c` | вдвое короче | ikki barobar qisqa | twice as short |
| `q3.c.hint` | Модуль множителя равен единице. | Ko'paytuvchining moduli birga teng. | The modulus of the factor equals one. |
| `q3.d` | тот же вектор | o'sha vektor | the same vector |
| `q3.d.hint` | Направление стало обратным. | Yo'nalish teskari bo'ldi. | The direction became reverse. |
| `q4.prompt` | Чему равна сумма вектора и противоположного? | Vektor va qarama-qarshining yig'indisi nimaga teng? | What does a vector plus its opposite equal? |
| `q4.a` [верно] | нулевому вектору | nol vektorga | the zero vector |
| `q4.b` | удвоенному вектору | ikkilangan vektorga | the doubled vector |
| `q4.b.hint` | Удвоение выйдет при сложении с самим собой. | Ikkilanish o'zi bilan qo'shganda chiqadi. | Doubling comes from adding it to itself. |
| `q4.c` | вектору той же длины | o'sha uzunlikdagi vektorga | a vector of the same length |
| `q4.c.hint` | Длина результата ноль. | Natijaning uzunligi nol. | The length of the result is zero. |
| `q4.d` | противоположному | qarama-qarshiga | the opposite one |
| `q4.d.hint` | Противоположный это одно из слагаемых. | Qarama-qarshi qo'shiluvchilardan biri. | The opposite is one of the terms. |
| `audio.mount` | Четыре вопроса подряд. Отвечай без остановки. | Ketma-ket to'rt savol. To'xtamasdan javob bering. | Four questions in a row. Answer without stopping. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `a + b = (5; 4; 4)` |
| `q2.done` | `a − b = (3; 4; 0)` |
| `q3.done` | `−a` |
| `q4.done` | `a + (−a) = 0` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nimani bilasiz | What you can do now |
| `can.1` | Складываю и вычитаю по осям | O'qlar bo'yicha qo'shaman va ayiraman | I add and subtract along the axes |
| `can.2` | Читаю разность с чертежа в нужном порядке | Ayirmani chizmadan kerakli tartibda o'qiyman | I read a difference off a drawing in the right order |
| `can.3` | Умножаю вектор на число | Vektorni songa ko'paytiraman | I multiply a vector by a number |
| `can.4` | Знаю, что нулевой вектор это ответ, а не ошибка | Nol vektor javob, xato emasligini bilaman | I know the zero vector is an answer, not a mistake |
| `levels.full` | Все четыре | To'rttasi ham | All four |
| `levels.gap` | Три из четырёх | To'rttadan uchtasi | Three out of four |
| `levels.back` | Меньше трёх | Uchtadan kam | Fewer than three |
| `bridge` | Дальше скалярное произведение — два вектора дадут не вектор, а число | Bundan keyin skalyar ko'paytma, ikki vektor vektor emas, son beradi | Next comes the dot product, where two vectors give not a vector but a number |
| `lifehack` | Прежде чем считать разность, скажи вслух, из какого конца в какой идёшь | Ayirmani hisoblashdan oldin qaysi oxirdan qaysi oxirga borayotganingizni ovoz chiqarib ayting | Before computing a difference, say aloud which end you go from and to |
| `sheetTitle` | Шпаргалка | Shpargalka | Cheat sheet |
| `sheetSrc` | Программа, блок восемь | Programma, sakkizinchi blok | The programme, block eight |
| `audio.mount` | Урок начался с вопроса, куда смотрит разность. | Dars ayirma qayerga qarashi haqidagi savol bilan boshlandi. | The lesson began with the question where the difference points. |
| `audio.next` | Она идёт из конца второго вектора в конец первого, и перепутать это легко, потому что обе стрелки лежат на одной прямой и длина у них одна. Поймать ошибку можно только по направлению или по знакам, и потому порядок надо выбирать до счёта, а не после. Сами действия при этом просты: и сумма, и разность считаются по каждой оси отдельно, а множитель проходит по всем трём числам, и длина берёт его модуль. Правило треугольника и правило параллелограмма дают один ответ, потому что это один чертёж с перенесённым вектором. А нулевой вектор в задачах это нормальный ответ: длина нуль, направления нет. Дальше два вектора начнут давать не вектор, а число. | U ikkinchi vektorning oxiridan birinchisining oxiriga boradi, va buni chalkashtirish oson, chunki ikki strelka ham bir to'g'ri chiziqda yotadi va uzunligi bitta. Xatoni faqat yo'nalish yoki ishoralar bo'yicha ushlash mumkin, shuning uchun tartibni hisobdan oldin tanlash kerak, keyin emas. Amallarning o'zi esa oddiy: yig'indi ham, ayirma ham har o'q bo'yicha alohida hisoblanadi, ko'paytuvchi esa uch sonning hammasiga o'tadi, va uzunlik uning modulini oladi. Uchburchak qoidasi va parallelogramm qoidasi bitta javob beradi, chunki bu ko'chirilgan vektorli bitta chizma. Nol vektor esa masalalarda oddiy javob: uzunligi nol, yo'nalishi yo'q. Keyin ikki vektor vektor emas, son bera boshlaydi. | It goes from the end of the second vector to the end of the first, and it is easy to mix up, because both arrows lie on one line and their length is the same. The mistake can be caught only by the direction or by the signs, and that is why the order must be chosen before the counting, not after. The operations themselves are simple: both the sum and the difference are computed along each axis separately, and the factor goes through all three numbers while the length takes its modulus. The triangle rule and the parallelogram rule give one answer, because it is one drawing with a shifted vector. And the zero vector in problems is a normal answer: length zero, no direction. Next two vectors will start giving not a vector but a number. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `(3; 4; 0)` |
| `hook.b` | `(−3; −4; 0)` |
| `proved` | `(3; 4; 0)` |
| `law` | `a − b = a + (−b)` |
| `sheet.1` | `a + b = (5; 4; 4)` |
| `sheet.2` | `a − b = (3; 4; 0)` |
| `sheet.3` | `2a = (8; 8; 4)` |
| `sheet.4` | `\|2a\| = 2\|a\|` |
| `sheet.5` | `a + (−a) = 0` |
