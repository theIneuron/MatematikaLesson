# Урок 53 — Скалярное произведение · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS52_KONTENT.md`.

Скелет: в переписке 2026-08-21. **Опоры в учебнике 10 класса нет** — векторов в пространстве нет
ни в одном из двух томов 2017 года. Источник истины — план. Блок читается как ПЕРВЫЙ проход.

**Главное решение урока.** Ошибка года `kosinussiz-kopaytma`: скалярное произведение считают
произведением длин, косинус теряют. Свидетель: длины не меняются, а произведение меняется вместе с
углом и обнуляется ровно на девяноста градусах. Значит длины произведение не определяют.

**Числа урока целые намеренно.** `a` равен четыре четыре два, длина шесть. `b` равен один два два,
длина три. Их произведение шестнадцать, произведение длин восемнадцать. Вектор `c` равен два минус
один минус два, длина три, и его произведение с `a` равно нулю. Скалярный квадрат `a` равен
тридцати шести. Произведение `b` и `c` равно минус четырём. На бумаге: длины шесть и три,
произведение девять, косинус одна вторая, угол шестьдесят градусов.

**Второй результат урока, кроме тега.** Знак произведения читает угол: больше нуля — острый, ноль —
прямой, меньше нуля — тупой. Это работает без всякого счёта косинуса и на экзамене экономит время.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины
`skalyar ko'paytma`, `skalyar kvadrat`, `perpendikulyarlik alomati`, `o'tmas burchak`,
`o'tkir burchak`.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРОИЗВЕДЕНИЕ | KO'PAYTMA | THE PRODUCT |
| `title` | Длины или суммы по осям | Uzunliklar yoki o'qlar bo'yicha yig'indi | Lengths or the sum along the axes |
| `row.a.name` | произведение длин | uzunliklar ko'paytmasi | the product of the lengths |
| `row.b.name` | сумма произведений по осям | o'qlar bo'yicha ko'paytmalar yig'indisi | the sum of products along the axes |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас посчитаем. | Javobingiz yozib olindi. Endi hisoblaymiz. | Your answer is recorded. Now we compute. |
| `audio.mount` | Два вектора, длины шесть и три. Ищем их скалярное произведение. | Ikki vektor, uzunliklari olti va uch. Ularning skalyar ko'paytmasini qidiramiz. | Two vectors, lengths six and three. We look for their dot product. |
| `audio.r1` | Первая запись перемножает длины и даёт восемнадцать. | Birinchi yozuv uzunliklarni ko'paytiradi va o'n sakkiz beradi. | The first reading multiplies the lengths and gives eighteen. |
| `audio.r2` | Вторая складывает произведения по осям и даёт шестнадцать. | Ikkinchisi o'qlar bo'yicha ko'paytmalarni qo'shadi va o'n olti beradi. | The second adds the products along the axes and gives sixteen. |
| `audio.ask` | Слово произведение подсказывает перемножить длины. Как думаешь, какая запись верная? | Ko'paytma so'zi uzunliklarni ko'paytirishga undaydi. Sizningcha qaysi yozuv to'g'ri? | The word product suggests multiplying the lengths. Which reading do you think is right? |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a (4; 4; 2),   b (1; 2; 2)` |
| `row.a.value` | `18` |
| `row.b.value` | `16` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса из курса | Kursdan uch savol | Three questions from the course |
| `q1.prompt` | Что даёт скалярное произведение? | Skalyar ko'paytma nima beradi? | What does a dot product give? |
| `q1.a` [верно] | число | son | a number |
| `q1.b` | вектор | vektor | a vector |
| `q1.b.hint` | Слово скалярное и значит, что результат число. | Skalyar so'zining o'zi natija son ekanini bildiradi. | The word scalar itself means the result is a number. |
| `q1.c` | угол | burchak | an angle |
| `q1.c.hint` | Угол из него достают, но сам он число. | Burchak undan olinadi, o'zi esa son. | The angle is extracted from it, but it is a number itself. |
| `q1.d` | длину | uzunlik | a length |
| `q1.d.hint` | Длина не бывает отрицательной, а произведение бывает. | Uzunlik manfiy bo'lmaydi, ko'paytma esa bo'ladi. | A length is never negative, a product can be. |
| `q2.prompt` | Чему равен косинус прямого угла? | To'g'ri burchakning kosinusi nimaga teng? | What is the cosine of a right angle? |
| `q2.a` [верно] | нулю | nolga | zero |
| `q2.b` | единице | birga | one |
| `q2.b.hint` | Единица это косинус нулевого угла. | Bir nol burchakning kosinusi. | One is the cosine of the zero angle. |
| `q2.c` | одной второй | bir ikkidan | one half |
| `q2.c.hint` | Одна вторая это шестьдесят градусов. | Bir ikkidan oltmish daraja. | One half is sixty degrees. |
| `q2.d` | минус единице | minus birga | minus one |
| `q2.d.hint` | Минус единица это развёрнутый угол. | Minus bir yoyilgan burchak. | Minus one is the straight angle. |
| `q3.prompt` | Как считается длина по тройке? | Uzunlik uchlik bo'yicha qanday hisoblanadi? | How is a length computed from a triple? |
| `q3.a` [верно] | корень из суммы квадратов | kvadratlar yig'indisidan ildiz | the root of the sum of squares |
| `q3.b` | сумма трёх чисел | uch sonning yig'indisi | the sum of the three numbers |
| `q3.b.hint` | Сумма даёт другое число. | Yig'indi boshqa sonni beradi. | The sum gives another number. |
| `q3.c` | произведение чисел | sonlar ko'paytmasi | the product of the numbers |
| `q3.c.hint` | Произведение обнулится, если есть ноль. | Nol bo'lsa, ko'paytma nolga aylanadi. | The product becomes zero if there is a zero. |
| `q3.d` | наибольшее из чисел | sonlarning eng kattasi | the largest of the numbers |
| `q3.d.hint` | Наибольшее это одно измерение. | Eng kattasi bitta o'lchov. | The largest is one dimension. |
| `audio.mount` | Три вопроса. Правило урока соберётся из первого и второго. | Uchta savol. Darsning qoidasi birinchi va ikkinchidan yig'iladi. | Three questions. The rule of the lesson will be assembled from the first and the second. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `a·b = 16` |
| `q2.done` | `cos 90° = 0` |
| `q3.done` | `\|a\| = 6` |

---

## Экран 3 · `explain1` · ответ `number` · тег `kosinussiz-kopaytma`

Считаем по осям.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Перемножаем по осям и складываем | O'qlar bo'yicha ko'paytiramiz va qo'shamiz | We multiply along the axes and add |
| `show.1.1` | вектор a и вектор b | a vektori va b vektori | the vector a and the vector b |
| `show.1.2` | по первой оси четыре на один | birinchi o'q bo'yicha to'rt karra bir | along the first axis four times one |
| `show.2.1` | и так по каждой оси | va har o'q bo'yicha shunday | and so along each axis |
| `show.2.2` | сумма равна шестнадцати | yig'indi o'n oltiga teng | the sum equals sixteen |
| `audio.mount` | Два вектора выпущены из одной точки, и между ними виден угол. | Ikki vektor bir nuqtadan chiqarilgan, va ular orasida burchak ko'rinadi. | Two vectors are drawn from one point, and the angle between them is visible. |
| `audio.move*` | Скалярное произведение считается по осям и очень коротко. Четыре умножить на один даёт четыре. Четыре умножить на два даёт восемь. Два умножить на два даёт четыре. Складываем и получаем шестнадцать. Обрати внимание на два свойства этой записи. Первое: результат число, а не вектор, и потому у него нет направления. Второе: порядок множителей не важен, произведение a на b и b на a одно и то же, потому что каждое слагаемое это произведение двух чисел. И заметь, что длины в этом счёте не участвовали вообще: понадобились только тройки. | Skalyar ko'paytma o'qlar bo'yicha va juda qisqa hisoblanadi. To'rtni birga ko'paytirsak to'rt bo'ladi. To'rtni ikkiga ko'paytirsak sakkiz bo'ladi. Ikkini ikkiga ko'paytirsak to'rt bo'ladi. Qo'shamiz va o'n olti chiqadi. Bu yozuvning ikki xossasiga e'tibor bering. Birinchisi: natija son, vektor emas, shuning uchun unda yo'nalish yo'q. Ikkinchisi: ko'paytuvchilar tartibi muhim emas, a karra b va b karra a bir xil, chunki har qo'shiluvchi ikki sonning ko'paytmasi. Va e'tibor bering, bu hisobda uzunliklar umuman qatnashmadi: faqat uchliklar kerak bo'ldi. | The dot product is computed along the axes and very briefly. Four times one gives four. Four times two gives eight. Two times two gives four. We add and get sixteen. Note two properties of this notation. First: the result is a number and not a vector, so it has no direction. Second: the order of the factors does not matter, a times b and b times a are the same, because every term is a product of two numbers. And note that the lengths did not take part in this counting at all: only the triples were needed. |
| `audio.work` | Посчитай сам. Чему равно скалярное произведение a и b? | O'zingiz hisoblang. a va b ning skalyar ko'paytmasi nimaga teng? | Work it out yourself. What does the dot product of a and b equal? |
| `work.prompt` | Скалярное произведение a и b? | a va b ning skalyar ko'paytmasi? | The dot product of a and b? |
| `work.ok` | Шестнадцать. Четыре плюс восемь плюс четыре. | O'n olti. To'rt qo'shuv sakkiz qo'shuv to'rt. | Sixteen. Four plus eight plus four. |
| `work.hint.1` | Перемножай числа по одной оси, потом складывай. | Sonlarni bir o'q bo'yicha ko'paytirib, keyin qo'shing. | Multiply the numbers along one axis, then add. |
| `work.hint.2` | Четыре, восемь, четыре. | To'rt, sakkiz, to'rt. | Four, eight, four. |
| `work.hint.3` | Шестнадцать. | O'n olti. | Sixteen. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a·b = 4 + 8 + 4` |
| `work.answer` | `16` |

---

## Экран 4 · `explain2` · ответ `number` · тег `kosinussiz-kopaytma`

Вторая формула: длины и косинус.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Длины входят вместе с косинусом | Uzunliklar kosinus bilan birga kiradi | The lengths enter together with the cosine |
| `show.1.1` | длина a равна шести | a ning uzunligi oltiga teng | the length of a equals six |
| `show.1.2` | длина b равна трём | b ning uzunligi uchga teng | the length of b equals three |
| `show.2.1` | произведение длин восемнадцать | uzunliklar ko'paytmasi o'n sakkiz | the product of the lengths is eighteen |
| `show.2.2` | а произведение шестнадцать | ko'paytma esa o'n olti | and the product is sixteen |
| `audio.mount` | Посчитаю длины обоих векторов и перемножу их. | Ikki vektorning uzunligini hisoblab, ularni ko'paytiraman. | Let me compute the lengths of both vectors and multiply them. |
| `audio.move*` | Шесть на три даёт восемнадцать, а скалярное произведение мы уже посчитали, и оно шестнадцать. Числа разные, и разница не случайна: у второй формулы есть третий множитель, косинус угла между векторами. Восемнадцать умножить на косинус даёт шестнадцать, значит косинус равен восьми девятым. Угол небольшой, векторы смотрят почти в одну сторону, и произведение поэтому близко к произведению длин. Вот и ответ на вопрос урока: перемножить длины можно, но это будет наибольшее возможное значение, а не само произведение. Совпадут они только тогда, когда косинус равен единице, то есть когда векторы сонаправлены. | Olti karra uch o'n sakkiz beradi, skalyar ko'paytmani esa biz allaqachon hisobladik, va u o'n olti. Sonlar boshqa, va farq bejiz emas: ikkinchi formulaning uchinchi ko'paytuvchisi bor, vektorlar orasidagi burchakning kosinusi. O'n sakkizni kosinusga ko'paytirsak o'n olti bo'ladi, demak kosinus sakkiz to'qqizdan. Burchak kichik, vektorlar deyarli bir tomonga qaraydi, va shuning uchun ko'paytma uzunliklar ko'paytmasiga yaqin. Ana darsning savoliga javob: uzunliklarni ko'paytirish mumkin, lekin bu eng katta mumkin bo'lgan qiymat bo'ladi, ko'paytmaning o'zi emas. Ular faqat kosinus birga teng bo'lganda, ya'ni vektorlar bir yo'nalishda bo'lganda mos tushadi. | Six times three gives eighteen, and we have already computed the dot product, and it is sixteen. The numbers differ, and the difference is no accident: the second formula has a third factor, the cosine of the angle between the vectors. Eighteen times the cosine gives sixteen, so the cosine equals eight ninths. The angle is small, the vectors point almost the same way, and that is why the product is close to the product of the lengths. There is the answer to the question of the lesson: you may multiply the lengths, but that will be the largest possible value and not the product itself. They coincide only when the cosine equals one, that is when the vectors have the same direction. |
| `audio.work` | Посчитай сам. Чему равно произведение длин? | O'zingiz hisoblang. Uzunliklar ko'paytmasi nimaga teng? | Work it out yourself. What does the product of the lengths equal? |
| `work.prompt` | Произведение длин? | Uzunliklar ko'paytmasi? | The product of the lengths? |
| `work.ok` | Восемнадцать. Шесть на три. | O'n sakkiz. Olti karra uch. | Eighteen. Six times three. |
| `work.hint.1` | Длины шесть и три. | Uzunliklar olti va uch. | The lengths are six and three. |
| `work.hint.2` | Их надо перемножить. | Ularni ko'paytirish kerak. | They must be multiplied. |
| `work.hint.3` | Восемнадцать. | O'n sakkiz. | Eighteen. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `\|a\|·\|b\| = 18` |
| `work.answer` | `18` |

---

## Экран 5 · `explain3` · ответ `number` · тег `kosinussiz-kopaytma`

Свидетель: произведение обнуляется ровно на прямом угле.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Ноль означает прямой угол | Nol to'g'ri burchakni bildiradi | Zero means a right angle |
| `show.1.1` | вектор c той же длины три | uzunligi o'sha uch bo'lgan c vektori | the vector c of the same length three |
| `show.1.2` | длины не изменились | uzunliklar o'zgarmadi | the lengths did not change |
| `show.2.1` | а произведение стало нулём | ko'paytma esa nol bo'ldi | and the product became zero |
| `show.2.2` | угол оказался прямым | burchak to'g'ri chiqdi | the angle turned out right |
| `audio.mount` | Заменю b на вектор c. Длина у него та же, три, а направление другое. | b ni c vektoriga almashtiraman. Uning uzunligi o'sha, uch, yo'nalishi esa boshqa. | Let me replace b with the vector c. Its length is the same, three, but its direction is different. |
| `audio.move*` | Считаю по осям: четыре на два даёт восемь, четыре на минус один даёт минус четыре, два на минус два даёт минус четыре. Сумма ноль. Длины не изменились, произведение изменилось, и это и есть ответ на главный вопрос урока: длины произведение не определяют. Более того, ноль тут не случайное совпадение. Произведение равно длинам, умноженным на косинус, длины не нули, значит нулём стал именно косинус. А косинус равен нулю ровно на девяноста градусах. Отсюда признак перпендикулярности, самый полезный в блоке: два вектора перпендикулярны тогда и только тогда, когда их скалярное произведение равно нулю. Проверка идёт по тройкам, без всякого чертежа и без всякого угла. | O'qlar bo'yicha hisoblayman: to'rt karra ikki sakkiz beradi, to'rt karra minus bir minus to'rt beradi, ikki karra minus ikki minus to'rt beradi. Yig'indi nol. Uzunliklar o'zgarmadi, ko'paytma o'zgardi, va bu darsning asosiy savoliga javob: uzunliklar ko'paytmani aniqlamaydi. Bundan tashqari, bu yerdagi nol tasodifiy mos tushish emas. Ko'paytma uzunliklar karra kosinusga teng, uzunliklar nol emas, demak aynan kosinus nol bo'ldi. Kosinus esa roppa-rosa to'qsan darajada nolga teng. Shundan perpendikulyarlik alomati, blokdagi eng foydalisi: ikki vektor faqat va faqat skalyar ko'paytmasi nolga teng bo'lganda perpendikulyar. Tekshiruv uchliklar bo'yicha boradi, hech qanday chizmasiz va hech qanday burchaksiz. | I compute along the axes: four times two gives eight, four times minus one gives minus four, two times minus two gives minus four. The sum is zero. The lengths did not change, the product did, and that is the answer to the main question of the lesson: the lengths do not determine the product. Moreover, the zero here is not a chance coincidence. The product equals the lengths times the cosine, the lengths are not zero, so it is the cosine that became zero. And the cosine equals zero exactly at ninety degrees. Hence the criterion of perpendicularity, the most useful one in the block: two vectors are perpendicular if and only if their dot product equals zero. The check goes by the triples, with no drawing and no angle at all. |
| `audio.work` | Посчитай сам. Чему равно произведение a и c? | O'zingiz hisoblang. a va c ning ko'paytmasi nimaga teng? | Work it out yourself. What does the product of a and c equal? |
| `work.prompt` | Произведение a и c? | a va c ning ko'paytmasi? | The product of a and c? |
| `work.ok` | Ноль. Значит угол прямой. | Nol. Demak burchak to'g'ri. | Zero. So the angle is right. |
| `work.hint.1` | Считай по осям, знаки учитывай. | O'qlar bo'yicha hisoblang, ishoralarni hisobga oling. | Compute along the axes, take the signs into account. |
| `work.hint.2` | Восемь минус четыре минус четыре. | Sakkiz minus to'rt minus to'rt. | Eight minus four minus four. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a·c = 0` |
| `work.answer` | `0` |

---

## Экран 6 · `explain4` · ответ `number` · тег `kosinussiz-kopaytma`

Скалярный квадрат: произведение вектора на себя.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Вектор на себя даёт квадрат длины | Vektor o'ziga karra uzunlik kvadratini beradi | A vector times itself gives the square of the length |
| `show.1.1` | берём a и умножаем на a | a ni olib, a ga ko'paytiramiz | we take a and multiply by a |
| `show.1.2` | угол между ними нулевой | ular orasidagi burchak nol | the angle between them is zero |
| `show.2.1` | косинус равен единице | kosinus birga teng | the cosine equals one |
| `show.2.2` | результат тридцать шесть | natija o'ttiz olti | the result is thirty six |
| `audio.mount` | Умножу вектор на самого себя. Угол между ним и им же нулевой. | Vektorni o'ziga ko'paytiraman. U va o'zi orasidagi burchak nol. | Let me multiply a vector by itself. The angle between it and itself is zero. |
| `audio.move*` | Косинус нулевого угла равен единице, значит произведение это просто длина на длину, то есть квадрат длины. По осям выходит то же: шестнадцать плюс шестнадцать плюс четыре даёт тридцать шесть, и это ровно шесть в квадрате. Отсюда удобный приём: если нужна длина, а под руками только тройка, можно посчитать скалярный квадрат и взять корень. И ещё одно следствие, важное для проверок. Скалярный квадрат никогда не бывает отрицательным, потому что он сумма квадратов. Значит если у тебя в решении вышел отрицательный скалярный квадрат, ошибка уже случилась, и искать её надо раньше. | Nol burchakning kosinusi birga teng, demak ko'paytma shunchaki uzunlik karra uzunlik, ya'ni uzunlik kvadrati. O'qlar bo'yicha ham o'sha chiqadi: o'n olti qo'shuv o'n olti qo'shuv to'rt o'ttiz olti beradi, va bu roppa-rosa olti kvadrat. Shundan qulay usul: uzunlik kerak bo'lsa, qo'l ostida esa faqat uchlik bo'lsa, skalyar kvadratni hisoblab, ildizini olish mumkin. Va yana bitta natija, tekshiruvlar uchun muhim. Skalyar kvadrat hech qachon manfiy bo'lmaydi, chunki u kvadratlar yig'indisi. Demak yechimingizda manfiy skalyar kvadrat chiqsa, xato allaqachon bo'lgan, va uni oldinroqdan qidirish kerak. | The cosine of the zero angle equals one, so the product is simply length times length, that is the square of the length. Along the axes the same comes out: sixteen plus sixteen plus four gives thirty six, and that is exactly six squared. Hence a handy trick: if you need a length and have only a triple at hand, you can compute the scalar square and take the root. And one more consequence, important for checking. A scalar square is never negative, because it is a sum of squares. So if a negative scalar square appeared in your solution, the mistake has already happened and must be looked for earlier. |
| `audio.work` | Посчитай сам. Чему равно произведение a на a? | O'zingiz hisoblang. a karra a nimaga teng? | Work it out yourself. What does a times a equal? |
| `work.prompt` | Произведение a на a? | a karra a? | The product of a times a? |
| `work.ok` | Тридцать шесть. Это шесть в квадрате. | O'ttiz olti. Bu olti kvadrat. | Thirty six. That is six squared. |
| `work.hint.1` | Длина a равна шести. | a ning uzunligi oltiga teng. | The length of a equals six. |
| `work.hint.2` | Косинус нулевого угла равен единице. | Nol burchakning kosinusi birga teng. | The cosine of the zero angle equals one. |
| `work.hint.3` | Тридцать шесть. | O'ttiz olti. | Thirty six. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a·a = 36` |
| `work.answer` | `36` |

---

## Экран 7 · `explain5` · ответ `number` · тег `kosinussiz-kopaytma`

ГРАНИЦА: знак произведения читает угол.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE EDGE CASE |
| `title` | Знак говорит про угол | Ishora burchak haqida aytadi | The sign speaks of the angle |
| `show.1.1` | три пары векторов | uch juft vektor | three pairs of vectors |
| `show.1.2` | произведения шестнадцать, ноль, минус четыре | ko'paytmalar o'n olti, nol, minus to'rt | the products are sixteen, zero, minus four |
| `show.2.1` | больше нуля значит острый | noldan katta o'tkir degani | greater than zero means acute |
| `show.2.2` | меньше нуля значит тупой | noldan kichik o'tmas degani | less than zero means obtuse |
| `audio.mount` | Возьмём третью пару, b и c. Обе длины по три, а произведение минус четыре. | Uchinchi juftni, b va c ni olamiz. Ikki uzunlik ham uch, ko'paytma esa minus to'rt. | Take the third pair, b and c. Both lengths are three and the product is minus four. |
| `audio.move*` | Отрицательное произведение не ошибка. Длины положительны всегда, значит знак пришёл от косинуса, а косинус отрицателен на тупых углах. Так знак становится инструментом: больше нуля значит угол острый, ровно ноль значит прямой, меньше нуля значит тупой. Это читается сразу по тройкам, без счёта косинуса, и на экзамене экономит время. И особый случай: если один из векторов нулевой, произведение тоже ноль, но перпендикулярности это не означает, потому что у нулевого вектора направления нет вовсе, и угол с ним не определён. Поэтому в признаке перпендикулярности всегда оговаривают, что оба вектора не нулевые. | Manfiy ko'paytma xato emas. Uzunliklar har doim musbat, demak ishora kosinusdan keldi, kosinus esa o'tmas burchaklarda manfiy. Shunday qilib ishora asbobga aylanadi: noldan katta -- burchak o'tkir, roppa-rosa nol -- to'g'ri, noldan kichik -- o'tmas. Bu uchliklar bo'yicha darrov o'qiladi, kosinusni hisoblamasdan, va imtihonda vaqt tejaydi. Va maxsus hol: vektorlardan biri nol bo'lsa, ko'paytma ham nol, lekin bu perpendikulyarlikni bildirmaydi -- nol vektorda yo'nalish umuman yo'q, va u bilan burchak aniqlanmagan. Shuning uchun perpendikulyarlik alomatida har doim ikki vektor ham nol emasligi aytiladi. | A negative product is not a mistake. Lengths are always positive, so the sign came from the cosine, and the cosine is negative at obtuse angles. So the sign becomes a tool: greater than zero means the angle is acute, exactly zero means right, less than zero means obtuse. That is read straight off the triples, without computing the cosine, and it saves time at the exam. And a special case: if one of the vectors is the zero vector, the product is zero too, but that does not mean perpendicularity, because the zero vector has no direction at all and the angle with it is undefined. That is why the criterion of perpendicularity always states that both vectors are non zero. |
| `audio.work` | Посчитай сам. Сколько из трёх пар дают прямой угол? | O'zingiz hisoblang. Uch juftdan nechtasi to'g'ri burchak beradi? | Work it out yourself. How many of the three pairs give a right angle? |
| `work.prompt` | Сколько пар дают прямой угол? | Nechta juft to'g'ri burchak beradi? | How many pairs give a right angle? |
| `work.ok` | Одна. Только та, где произведение ноль. | Bittasi. Faqat ko'paytmasi nol bo'lgani. | One. Only the one whose product is zero. |
| `work.hint.1` | Прямой угол это ровно ноль. | To'g'ri burchak roppa-rosa nol. | A right angle is exactly zero. |
| `work.hint.2` | Шестнадцать и минус четыре не нули. | O'n olti va minus to'rt nol emas. | Sixteen and minus four are not zero. |
| `work.hint.3` | Одна. | Bittasi. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `b·c = −4` |
| `work.answer` | `1` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `kosinussiz-kopaytma`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Две формулы одного числа | Bitta sonning ikki formulasi | Two formulas of one number |
| `probe.question` | Когда произведение равно произведению длин? | Ko'paytma uzunliklar ko'paytmasiga qachon teng? | When does the product equal the product of the lengths? |
| `probe.a` [верно] | когда векторы сонаправлены | vektorlar bir yo'nalishda bo'lganda | when the vectors have the same direction |
| `probe.b` | всегда | har doim | always |
| `probe.b.hint` | Тогда косинус был бы всегда единицей. | U holda kosinus har doim bir bo'lardi. | Then the cosine would always be one. |
| `rule.lawLabel` | Скалярное произведение | Skalyar ko'paytma | The dot product |
| `rule.lines.1` | по тройкам это сумма произведений по осям | uchliklar bo'yicha bu o'qlar bo'yicha ko'paytmalar yig'indisi | by triples it is the sum of products along the axes |
| `rule.lines.2` | через длины это длины, умноженные на косинус угла | uzunliklar orqali bu uzunliklar karra burchak kosinusi | through lengths it is the lengths times the cosine of the angle |
| `rule.lines.3` | ноль означает прямой угол, если оба вектора не нулевые | nol to'g'ri burchakni bildiradi, agar ikki vektor ham nol bo'lmasa | zero means a right angle, provided both vectors are non zero |
| `audio.mount` | Один вопрос на различение, потом карточка. | Farqlashga bitta savol, keyin kartochka. | One question to tell them apart, then the card. |
| `audio.rule*` | Две формулы дают одно и то же число, и в этом вся сила. Первая считается по тройкам и не требует ни чертежа, ни угла. Вторая объясняет смысл и позволяет найти угол, когда тройки известны. Вместе они работают так: посчитал по осям, поделил на произведение длин, получил косинус. Третья строка это признак перпендикулярности, и он самый частый на экзамене. Оговорка про нулевые векторы не формальность: у нулевого вектора направления нет, и угол с ним не определён, поэтому ноль в этом случае ничего про угол не говорит. | Ikki formula bir xil sonni beradi, va butun kuch shunda. Birinchisi uchliklar bo'yicha hisoblanadi va na chizma, na burchak talab qiladi. Ikkinchisi ma'noni tushuntiradi va uchliklar ma'lum bo'lganda burchakni topishga imkon beradi. Birgalikda ular shunday ishlaydi: o'qlar bo'yicha hisobladingiz, uzunliklar ko'paytmasiga bo'ldingiz, kosinusni oldingiz. Uchinchi satr perpendikulyarlik alomati, va u imtihonda eng ko'p uchraydi. Nol vektorlar haqidagi shart rasmiyatchilik emas: nol vektorda yo'nalish yo'q, va u bilan burchak aniqlanmagan, shuning uchun bu holda nol burchak haqida hech narsa aytmaydi. | The two formulas give one and the same number, and that is where all the power lies. The first is computed by triples and requires neither a drawing nor an angle. The second explains the meaning and lets you find the angle when the triples are known. Together they work like this: you computed along the axes, divided by the product of the lengths, got the cosine. The third line is the criterion of perpendicularity, and it is the most frequent one at the exam. The clause about zero vectors is not a formality: the zero vector has no direction and the angle with it is undefined, so zero in that case says nothing about the angle. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `a·b = \|a\|·\|b\|·cos φ` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `kosinussiz-kopaytma`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | AMALIYOT | PRACTICE |
| `title` | Пара и её произведение | Juft va uning ko'paytmasi | A pair and its product |
| `match.prompt` | Соедини число с парой | Sonni juft bilan birlashtiring | Match the number with the pair |
| `match.ok` | Все четыре на месте. Знак читает угол. | To'rttasi ham joyida. Ishora burchakni o'qiydi. | All four in place. The sign reads the angle. |
| `audio.mount` | Четыре числа и четыре пары. Считай по осям. | To'rt son va to'rt juft. O'qlar bo'yicha hisoblang. | Four numbers and four pairs. Count along the axes. |
| `match.a` | a и b | a va b | a and b |
| `match.b` | a и c | a va c | a and c |
| `match.c` | a и a | a va a | a and a |
| `match.d` | b и c | b va c | b and c |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `16` · `0` · `36` · `−4` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `kosinussiz-kopaytma`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Докажи, что векторы перпендикулярны | Vektorlar perpendikulyar ekanini isbotlang | Prove the vectors are perpendicular |
| `proof.given` | тройки векторов a и c, оба не нулевые | a va c vektorlarining uchliklari, ikkisi ham nol emas | the triples of a and c, both non zero |
| `proof.goal` | угол между ними прямой | ular orasidagi burchak to'g'ri | the angle between them is right |
| `proof.r1` | произведение по осям равно нулю | o'qlar bo'yicha ko'paytma nolga teng | the product along the axes equals zero |
| `proof.r2` | длины не нули, значит нулём стал косинус | uzunliklar nol emas, demak kosinus nol bo'ldi | the lengths are not zero, so it is the cosine that became zero |
| `proof.r3` | косинус равен нулю на девяноста градусах | kosinus to'qsan darajada nolga teng | the cosine equals zero at ninety degrees |
| `proof.ok` | Доказано. Признак работает по тройкам, без чертежа. | Isbotlandi. Alomat uchliklar bo'yicha, chizmasiz ishlaydi. | Proved. The criterion works by triples, without a drawing. |
| `proof.e1` | Про длины дальше. Сначала посчитай произведение. | Uzunliklar haqida keyin. Avval ko'paytmani hisoblang. | The lengths come later. First compute the product. |
| `proof.e2` | Ноль получен. Теперь почему это косинус. | Nol olindi. Endi bu nega kosinus. | The zero is obtained. Now why it is the cosine. |
| `proof.e3` | Косинус ноль. Теперь вывод про угол. | Kosinus nol. Endi burchak haqida xulosa. | The cosine is zero. Now the conclusion about the angle. |
| `reason.s1` | произведение считается по осям | ko'paytma o'qlar bo'yicha hisoblanadi | the product is computed along the axes |
| `reason.s2` | вторая формула произведения | ko'paytmaning ikkinchi formulasi | the second formula of the product |
| `reason.s3` | косинус прямого угла равен нулю | to'g'ri burchakning kosinusi nolga teng | the cosine of a right angle equals zero |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование. Он показывает один ракурс из многих. | Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification. It shows one view out of many. |
| `audio.mount` | Три строки, и у каждой своё обоснование из списка. | Uch qator, va har birining ro'yxatdan o'z asoslashi bor. | Three lines, each with its own justification from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a·c = 0` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO TOOL |
| `title` | Счёт и порядок | Hisob va tartib | Counting and order |
| `task.ok` | Шестьдесят. Косинус вышел одна вторая. | Oltmish. Kosinus bir ikkidan chiqdi. | Sixty. The cosine came out one half. |
| `task.hint.1` | Раздели произведение на произведение длин. | Ko'paytmani uzunliklar ko'paytmasiga bo'ling. | Divide the product by the product of the lengths. |
| `task.hint.2` | Девять на восемнадцать даёт одну вторую. | To'qqizni o'n sakkizga bo'lsak bir ikkidan bo'ladi. | Nine over eighteen gives one half. |
| `task.hint.3` | Шестьдесят градусов. | Oltmish daraja. | Sixty degrees. |
| `order.prompt` | Расставь шаги в том порядке, в каком считают | Qadamlarni hisoblash tartibida joylashtiring | Arrange the steps in the order they are computed |
| `order.title` | Порядок счёта | Hisob tartibi | The order of computing |
| `order.ok` | Порядок верный. Произведение, длины, косинус, угол. | Tartib to'g'ri. Ko'paytma, uzunliklar, kosinus, burchak. | The order is right. The product, the lengths, the cosine, the angle. |
| `order.bad` | Не в этом порядке. Что нужно раньше. | Bu tartibda emas. Avval nima kerak. | Not in this order. What is needed first. |
| `audio.mount` | Прибор убран. Считаем на бумаге. | Asbob olib qo'yildi. Qog'ozda hisoblaymiz. | The tool is put away. We count on paper. |
| `audio.next` | Теперь порядок шагов. Расставь их так, как считают. | Endi qadamlar tartibi. Ularni qanday hisoblansa, shunday joylashtiring. | Now the order of the steps. Arrange them the way the counting goes. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `\|a\| = 6,   \|b\| = 3,   a·b = 9,   φ = ?` |
| `task.answer` | `60` |
| `order.items` | `φ` · `a·b` · `cos φ` · `\|a\|·\|b\|` |
| `order.answer` | `a·b  \|a\|·\|b\|  cos φ  φ` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xato qatorni toping | Find the line with the mistake |
| `hint.r1` | Данные выписаны верно. | Berilganlar to'g'ri yozilgan. | The data are written correctly. |
| `hint.r2` | Длины посчитаны верно. | Uzunliklar to'g'ri hisoblangan. | The lengths are computed correctly. |
| `hint.r4` | Косинус получен из неверной строки выше. | Kosinus yuqoridagi xato qatordan olingan. | The cosine comes from the wrong line above. |
| `proof` | Поверни сцену: длины держатся, а произведение меняется вместе с углом. | Sahnani buring: uzunliklar turadi, ko'paytma esa burchak bilan o'zgaradi. | Rotate the scene: the lengths hold while the product changes with the angle. |
| `entry.prompt` | Номер строки с ошибкой | Xato qator raqami | The number of the line with the mistake |
| `entry.ok` | Третья. Произведение взяли как произведение длин. | Uchinchi. Ko'paytma uzunliklar ko'paytmasi deb olingan. | The third. The product was taken as the product of the lengths. |
| `entry.hint.1` | Проверь, откуда взялось число в третьей строке. | Uchinchi qatordagi son qayerdan olinganini tekshiring. | Check where the number in the third line came from. |
| `entry.hint.2` | По осям выходит шестнадцать, а не восемнадцать. | O'qlar bo'yicha o'n olti chiqadi, o'n sakkiz emas. | Along the axes sixteen comes out, not eighteen. |
| `entry.hint.3` | Ошибка в третьей строке. | Xato uchinchi qatorda. | The mistake is in the third line. |
| `audio.mount` | Четыре строки, и одна из них теряет косинус. | To'rt qator, va ulardan biri kosinusni yo'qotadi. | Four lines, and one of them loses the cosine. |
| `audio.next` | Теперь напиши номер строки, в которой ошибка. | Endi xato bo'lgan qator raqamini yozing. | Now write the number of the line with the mistake. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `a (4; 4; 2),   b (1; 2; 2)` |
| `row.r2` | `\|a\| = 6,   \|b\| = 3` |
| `row.r3` | `a·b = 18` |
| `row.r4` | `cos φ = 1` |
| `answerId` | `r3` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | В обратную сторону | Teskari tomonga | The other way round |
| `place.prompt` | Скалярное произведение двух ненулевых векторов равно нулю. Каков угол между ними в градусах? | Ikki nolmas vektorning skalyar ko'paytmasi nolga teng. Ular orasidagi burchak necha daraja? | The dot product of two non zero vectors equals zero. What is the angle between them in degrees? |
| `place.ok` | Девяносто. Ноль означает прямой угол. | To'qsan. Nol to'g'ri burchakni bildiradi. | Ninety. Zero means a right angle. |
| `place.wrong` | Длины не нули, значит нулём стал косинус. | Uzunliklar nol emas, demak kosinus nol bo'ldi. | The lengths are not zero, so it is the cosine that became zero. |
| `multi.prompt` | Отметь все верные записи | Barcha to'g'ri yozuvlarni belgilang | Mark all the correct readings |
| `multi.title` | Что верно для этих векторов | Bu vektorlar uchun nima to'g'ri | What is true for these vectors |
| `multi.d.hint` | Это произведение длин, а не скалярное произведение. | Bu uzunliklar ko'paytmasi, skalyar ko'paytma emas. | That is the product of the lengths, not the dot product. |
| `multi.e.hint` | Скалярный квадрат отрицательным не бывает. | Skalyar kvadrat manfiy bo'lmaydi. | A scalar square is never negative. |
| `multi.ok` | Три записи из пяти. Две оставшиеся теряют косинус и знак. | Beshtadan uch yozuv. Qolgan ikkitasi kosinus va ishorani yo'qotadi. | Three readings out of five. The other two lose the cosine and the sign. |
| `audio.mount` | Прочитаем урок справа налево. Дано произведение, найти надо угол. | Darsni o'ngdan chapga o'qiymiz. Ko'paytma berilgan, burchakni topish kerak. | Let us read the lesson from right to left. The product is given, the angle is to be found. |
| `audio.work` | Отметь все записи, которые верны. Их больше одной. | To'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p. | Mark all the readings that are correct. There is more than one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `90` |
| `place.step` | `cos φ = 0` |
| `multi.a` [верно] | `a·b = 16` |
| `multi.b` [верно] | `a·c = 0` |
| `multi.c` [верно] | `a·a = 36` |
| `multi.d` | `a·b = 18` |
| `multi.e` | `a·a = −36` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `kosinussiz-kopaytma`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Что даёт скалярное произведение? | Skalyar ko'paytma nima beradi? | What does a dot product give? |
| `q1.a` [верно] | число | son | a number |
| `q1.b` | вектор | vektor | a vector |
| `q1.b.hint` | Слово скалярное и значит число. | Skalyar so'zining o'zi son degani. | The word scalar itself means a number. |
| `q1.c` | длину | uzunlik | a length |
| `q1.c.hint` | Длина не бывает отрицательной. | Uzunlik manfiy bo'lmaydi. | A length is never negative. |
| `q1.d` | площадь | yuza | an area |
| `q1.d.hint` | Площадь тут ни при чём. | Yuzaning bunga aloqasi yo'q. | An area has nothing to do with it. |
| `q2.prompt` | Что означает ноль у ненулевых векторов? | Nolmas vektorlarda nol nimani bildiradi? | What does zero mean for non zero vectors? |
| `q2.a` [верно] | прямой угол | to'g'ri burchak | a right angle |
| `q2.b` | нулевой угол | nol burchak | the zero angle |
| `q2.b.hint` | При нулевом угле произведение наибольшее. | Nol burchakda ko'paytma eng katta. | At the zero angle the product is the largest. |
| `q2.c` | тупой угол | o'tmas burchak | an obtuse angle |
| `q2.c.hint` | У тупого произведение отрицательное. | O'tmasda ko'paytma manfiy. | For an obtuse angle the product is negative. |
| `q2.d` | что векторы равны | vektorlar teng ekanini | that the vectors are equal |
| `q2.d.hint` | У равных произведение это квадрат длины. | Tenglarda ko'paytma uzunlik kvadrati. | For equal vectors the product is the square of the length. |
| `q3.prompt` | Чему равно произведение вектора на себя? | Vektorning o'ziga ko'paytmasi nimaga teng? | What does a vector times itself equal? |
| `q3.a` [верно] | квадрату длины | uzunlik kvadratiga | the square of the length |
| `q3.b` | длине | uzunlikka | the length |
| `q3.b.hint` | Косинус единица, но длина входит дважды. | Kosinus bir, lekin uzunlik ikki marta kiradi. | The cosine is one, but the length enters twice. |
| `q3.c` | нулю | nolga | zero |
| `q3.c.hint` | Ноль был бы при прямом угле. | Nol to'g'ri burchakda bo'lardi. | Zero would be at a right angle. |
| `q3.d` | удвоенной длине | ikkilangan uzunlikka | the doubled length |
| `q3.d.hint` | Удвоение это другое действие. | Ikkilanish boshqa amal. | Doubling is another operation. |
| `q4.prompt` | О чём говорит отрицательное произведение? | Manfiy ko'paytma nima haqida aytadi? | What does a negative product say? |
| `q4.a` [верно] | угол тупой | burchak o'tmas | the angle is obtuse |
| `q4.b` | в решении ошибка | yechimda xato | there is a mistake in the solution |
| `q4.b.hint` | Отрицательное произведение бывает и это норма. | Manfiy ko'paytma bo'ladi va bu odatiy. | A negative product does happen and it is normal. |
| `q4.c` | длина отрицательна | uzunlik manfiy | the length is negative |
| `q4.c.hint` | Длина всегда положительна. | Uzunlik har doim musbat. | A length is always positive. |
| `q4.d` | векторы перпендикулярны | vektorlar perpendikulyar | the vectors are perpendicular |
| `q4.d.hint` | Перпендикулярность это ровно ноль. | Perpendikulyarlik roppa-rosa nol. | Perpendicularity is exactly zero. |
| `audio.mount` | Четыре вопроса подряд. Отвечай без остановки. | Ketma-ket to'rt savol. To'xtamasdan javob bering. | Four questions in a row. Answer without stopping. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `a·b = 16` |
| `q2.done` | `cos 90° = 0` |
| `q3.done` | `a·a = 36` |
| `q4.done` | `b·c = −4` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nimani bilasiz | What you can do now |
| `can.1` | Считаю произведение по осям | Ko'paytmani o'qlar bo'yicha hisoblayman | I compute the product along the axes |
| `can.2` | Нахожу косинус угла по тройкам | Burchak kosinusini uchliklar bo'yicha topaman | I find the cosine of the angle from the triples |
| `can.3` | Проверяю перпендикулярность нулём | Perpendikulyarlikni nol bilan tekshiraman | I check perpendicularity by zero |
| `can.4` | Читаю угол по знаку произведения | Burchakni ko'paytma ishorasi bo'yicha o'qiyman | I read the angle from the sign of the product |
| `levels.full` | Все четыре | To'rttasi ham | All four |
| `levels.gap` | Три из четырёх | To'rttadan uchtasi | Three out of four |
| `levels.back` | Меньше трёх | Uchtadan kam | Fewer than three |
| `bridge` | Дальше уравнение плоскости — тройка коэффициентов окажется нормалью | Bundan keyin tekislik tenglamasi, koeffitsiyentlar uchligi normal bo'lib chiqadi | Next comes the equation of a plane, where the triple of coefficients turns out to be a normal |
| `lifehack` | Посмотри на знак произведения прежде, чем считать косинус | Kosinusni hisoblashdan oldin ko'paytma ishorasiga qarang | Look at the sign of the product before computing the cosine |
| `sheetTitle` | Шпаргалка | Shpargalka | Cheat sheet |
| `sheetSrc` | Программа, блок восемь | Programma, sakkizinchi blok | The programme, block eight |
| `audio.mount` | Урок начался с вопроса, перемножать ли длины. | Dars uzunliklarni ko'paytirish kerakmi degan savol bilan boshlandi. | The lesson began with the question whether to multiply the lengths. |
| `audio.next` | Перемножить их можно, но выйдет наибольшее возможное значение, а не произведение: в настоящей формуле есть третий множитель, косинус угла. Считать проще по тройкам, там нужны только числа, и результат получается сразу. Отсюда всё остальное. Длины произведение не определяют: мы поменяли только направление, длины остались, а число стало нулём. Ноль при ненулевых векторах означает прямой угол, и это самая частая проверка на экзамене. Вектор на себя даёт квадрат длины, потому что косинус нулевого угла равен единице. А знак читает угол без всякого счёта: больше нуля острый, ноль прямой, меньше нуля тупой. Дальше появится уравнение плоскости, и тройка коэффициентов в нём окажется нормалью. | Ularni ko'paytirish mumkin, lekin eng katta mumkin bo'lgan qiymat chiqadi, ko'paytmaning o'zi emas: haqiqiy formulada uchinchi ko'paytuvchi, burchak kosinusi bor. Uchliklar bo'yicha hisoblash oddiyroq, u yerda faqat sonlar kerak, va natija darrov chiqadi. Qolgani shundan. Uzunliklar ko'paytmani aniqlamaydi: biz faqat yo'nalishni o'zgartirdik, uzunliklar qoldi, son esa nol bo'ldi. Nolmas vektorlarda nol to'g'ri burchakni bildiradi, va bu imtihonda eng ko'p uchraydigan tekshiruv. Vektorning o'ziga ko'paytmasi uzunlik kvadratini beradi, chunki nol burchakning kosinusi birga teng. Ishora esa burchakni hisobsiz o'qiydi: noldan katta o'tkir, nol to'g'ri, noldan kichik o'tmas. Keyin tekislik tenglamasi paydo bo'ladi, va undagi koeffitsiyentlar uchligi normal bo'lib chiqadi. | You may multiply them, but the largest possible value comes out and not the product: the real formula has a third factor, the cosine of the angle. Counting is simpler by triples, only numbers are needed there, and the result comes at once. Everything else follows. The lengths do not determine the product: we changed only the direction, the lengths stayed, and the number became zero. Zero for non zero vectors means a right angle, and that is the most frequent check at the exam. A vector times itself gives the square of the length, because the cosine of the zero angle equals one. And the sign reads the angle without any counting: greater than zero acute, zero right, less than zero obtuse. Next the equation of a plane will appear, and the triple of coefficients in it will turn out to be a normal. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `18` |
| `hook.b` | `16` |
| `proved` | `16` |
| `law` | `a·b = \|a\|·\|b\|·cos φ` |
| `sheet.1` | `a·b = 16` |
| `sheet.2` | `\|a\|·\|b\| = 18` |
| `sheet.3` | `a·c = 0` |
| `sheet.4` | `a·a = 36` |
| `sheet.5` | `b·c = −4` |
