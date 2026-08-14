# 6 класс, урок 1 «Делители и кратные» — КОНТЕНТ v4

> Этап 2 производства. Записано 2026-08-13.
> Вход: `GRADE6_DARS01_SKELET_v4.md` (15 экранов).
> Выход: контракт для этапа 3 (сборка).
> Три языка: ru / uz / en. Узбекская математическая терминология — **draft,
> требует валидации узбекским методистом математики** (список терминов в §17).

## Соглашения

- **Экранный текст** может содержать формулы и символы: `24 : 6 = 4`.
- **Озвучка** символов не содержит вообще: числа словами, знаки словами.
  На каждый неверный вариант — своя пара: `wrong_N` (видно) и `audio_hint_N` (звучит).
- RU — обращение на «ты», прошедшее время без привязки к полу.
- UZ — обращение на «siz», апостроф ASCII `'`, порядок слов SOV, кириллицы нет.
- Озвучка **шире** экранного текста: она добавляет смысл, а не читает подпись.

---

## Экран 1 — ХУК. Турнир

Готов, переносится без изменений. Ключевые строки — в текущем `CONTENT.s_hook`.

---

## Экран 2 — ВСПОМНИМ. Таблица умножения это список делителей

### Экран

| Ключ | RU | UZ | EN |
|---|---|---|---|
| eyebrow | Вспомним | Eslaymiz | Recall |
| title | Ты это уже знаешь | Buni siz allaqachon bilasiz | You already know this |
| lead | Начнём с того, что учили давно | Ancha oldin o'rganganimizdan boshlaymiz | Let us start with something learned long ago |
| eq | 3 · 4 = 12 | 3 · 4 = 12 | 3 · 4 = 12 |
| lbl_div_a | 3 — делитель числа 12 | 3 — 12 ning bo'luvchisi | 3 is a divisor of 12 |
| lbl_div_b | 4 — делитель числа 12 | 4 — 12 ning bo'luvchisi | 4 is a divisor of 12 |
| lbl_mul_a | 12 — кратное числа 3 | 12 — 3 ning karralisi | 12 is a multiple of 3 |
| lbl_mul_b | 12 — кратное числа 4 | 12 — 4 ning karralisi | 12 is a multiple of 4 |
| note | Таблица умножения — готовый список делителей | Ko'paytirish jadvali — tayyor bo'luvchilar ro'yxati | The times table is a ready list of divisors |

### Озвучка (кадр за кадром)

**RU**
1. Начнём с того, что ты знаешь давно. Трижды четыре двенадцать. Ничего нового тут нет.
2. А теперь новое, и только одно. Раз двенадцать получилось из тройки и четвёрки, значит тройка и четвёрка называются делителями двенадцати.
3. И обратно. Двенадцать называется кратным тройки и кратным четвёрки.
4. Получается, таблица умножения, которую ты давно выучил, это готовый список делителей. Новую тему ты наполовину уже знаешь.

**UZ**
1. Ancha oldin bilganingizdan boshlaymiz. Uch karra to'rt o'n ikki. Bu yerda yangi narsa yo'q.
2. Endi yangisi, faqat bitta. O'n ikki uch va to'rtdan chiqdi, demak uch va to'rt o'n ikkining bo'luvchilari deyiladi.
3. Teskarisi ham shunday. O'n ikki uchning karralisi va to'rtning karralisi deyiladi.
4. Demak, siz ancha oldin yodlagan ko'paytirish jadvali tayyor bo'luvchilar ro'yxati ekan. Yangi mavzuning yarmini siz allaqachon bilasiz.

**EN**
1. Let us start with what you have known for a long time. Three times four is twelve. Nothing new here.
2. Now the new part, and there is only one. Since twelve came from three and four, three and four are called divisors of twelve.
3. And the other way round. Twelve is called a multiple of three and a multiple of four.
4. So the times table you learned long ago is a ready list of divisors. You already know half of this topic.

---

## Экран 3 — ОБЪЯСНЕНИЕ 1. Один пример — два названия

Существующий `CONTENT.s1`. Переносится. Правка одна — мостик к экрану 2.

| Ключ | RU | UZ | EN |
|---|---|---|---|
| bridge | Возьмём другой пример и назовём в нём каждое число | Boshqa misol olamiz va undagi har bir sonni nomlaymiz | Let us take another example and name every number in it |

Остальные строки и озвучка — как в текущем уроке.

---

## Экран 4 — ОБЪЯСНЕНИЕ 2. СПОСОБ 1: делится или нет

### Экран

| Ключ | RU | UZ | EN |
|---|---|---|---|
| eyebrow | Способ 1 | 1-usul | Method 1 |
| title | Делится или нет | Bo'linadimi yoki yo'q | Does it divide or not |
| method_title | Способ 1. Проверить одно число | 1-usul. Bitta sonni tekshirish | Method 1. Check one number |
| step_1 | Раздели | Bo'ling | Divide |
| step_2 | Посмотри остаток | Qoldiqqa qarang | Look at the remainder |
| step_3 | Остаток 0 — делится | Qoldiq 0 — bo'linadi | Remainder 0 means it divides |
| step_no | Остаток не 0 — не делится | Qoldiq 0 emas — bo'linmaydi | A remainder that is not 0 means it does not |
| demo_banner | Смотри — покажу на примере | Qarang — misolda ko'rsataman | Watch, I will show an example |
| play_banner | Теперь твоя очередь | Endi navbat sizniki | Now it is your turn |
| to_play | Теперь я сам! | Endi o'zim! | Now on my own! |
| again | Ещё раз | Yana | Again |
| go | Проверить | Tekshirish | Check |
| note_ok | Делится без остатка. {d} — делитель числа {n}, {n} — кратное числа {d}. | Qoldiqsiz bo'linadi. {d} — {n} ning bo'luvchisi, {n} — {d} ning karralisi. | It divides with no remainder. {d} is a divisor of {n}, and {n} is a multiple of {d}. |
| note_no | Не делится без остатка. {d} не является делителем числа {n}. | Qoldiqsiz bo'linmaydi. {d} — {n} ning bo'luvchisi emas. | It does not divide evenly, so {d} is not a divisor of {n}. |
| task | Проверь число 25 разными делителями. Верного ответа тут нет — есть факт. | 25 sonini turli bo'luvchilar bilan tekshiring. Bu yerda to'g'ri javob yo'q — fakt bor. | Try 25 with different divisors. There is no right answer here, only a fact. |

### Озвучка

**RU**
- intro: Первый способ самый короткий. Он отвечает на один вопрос. Делится это число на то или нет. Смотри, беру двадцать четыре плитки и проверяю, делятся ли они на шесть.
- demo_done: Ряды получились ровные, лишнего не осталось. Двадцать четыре делится на шесть без остатка. Значит шесть делитель двадцати четырёх, а двадцать четыре кратно шести.
- play_start: Теперь ты. Число двадцать пять. Выбери делитель и нажми проверить. Смотри не на красоту рядов, а на остаток.
- ok: Ряды получились ровные, остаток ноль. Значит выбранное число делитель, а двадцать пять ему кратно.
- no: Остались лишние плитки. Остаток не ноль, значит выбранное число не делитель двадцати пяти.

**UZ**
- intro: Birinchi usul eng qisqasi. U bitta savolga javob beradi. Bu son unga bo'linadimi yoki yo'q. Qarang, yigirma to'rtta plitka olaman va ular oltiga bo'linadimi, tekshiraman.
- demo_done: Qatorlar tekis chiqdi, ortiqcha qolmadi. Yigirma to'rt oltiga qoldiqsiz bo'linadi. Demak olti yigirma to'rtning bo'luvchisi, yigirma to'rt esa oltiga karrali.
- play_start: Endi navbat sizniki. Son yigirma besh. Bo'luvchini tanlang va tekshirish tugmasini bosing. Qatorlarning chiroyiga emas, qoldiqqa qarang.
- ok: Qatorlar tekis chiqdi, qoldiq nol. Demak tanlangan son bo'luvchi, yigirma besh esa unga karrali.
- no: Ortiqcha plitkalar qoldi. Qoldiq nol emas, demak tanlangan son yigirma beshning bo'luvchisi emas.

**EN**
- intro: The first method is the shortest. It answers one question. Does this number divide by that one or not. Watch, I take twenty four tiles and check whether they divide by six.
- demo_done: The rows came out even and nothing was left over. Twenty four divides by six with no remainder. So six is a divisor of twenty four, and twenty four is a multiple of six.
- play_start: Now it is your turn. The number is twenty five. Choose a divisor and tap check. Look at the remainder, not at how neat the rows are.
- ok: The rows came out even and the remainder is zero. So the number you chose is a divisor, and twenty five is a multiple of it.
- no: Some tiles are left over. The remainder is not zero, so the number you chose is not a divisor of twenty five.

---

## Экран 5 — ОБЪЯСНЕНИЕ 3. СПОСОБ 2: делители парами

### Экран

| Ключ | RU | UZ | EN |
|---|---|---|---|
| eyebrow | Способ 2 | 2-usul | Method 2 |
| title | Делители ищем парами | Bo'luvchilarni juftlab qidiramiz | Finding divisors in pairs |
| method_title | Способ 2. Найти все делители | 2-usul. Barcha bo'luvchilarni topish | Method 2. Find every divisor |
| step_1 | Пиши 1 и само число — эта пара есть всегда | 1 va sonning o'zini yozing — bu juftlik doim bor | Write 1 and the number itself, this pair is always there |
| step_2 | Пробуй 2, 3, 4 и дальше по порядку | 2, 3, 4 va keyingilarini tartib bilan sinang | Try 2, 3, 4 and on in order |
| step_3 | Разделилось — пиши оба числа пары | Bo'lindi — juftlikning ikkala sonini yozing | If it divides, write both numbers of the pair |
| step_4 | Стоп, когда левое встретило правое | Chap o'ngga yetganda to'xtang | Stop when the left one meets the right one |
| cap_all | Делители числа 12 | 12 ning bo'luvchilari | Divisors of 12 |
| meet | Слева и справа встретились. Дальше пар нет, все делители найдены. | Chap va o'ng uchrashdi. Boshqa juftlik yo'q, barcha bo'luvchilar topildi. | The left and the right have met. There are no more pairs, all divisors are found. |

### Озвучка

**RU**
1. Второй способ отвечает на вопрос потруднее. Не делится ли на одно число, а какие вообще делители есть у числа. Ищем их парами.
2. Первая пара есть у любого числа. Это единица и само число. Один умножить на двенадцать двенадцать. Значит и один, и двенадцать делители. Оба уходят в ряд.
3. Дальше пробуем по порядку. Два и шесть. Два умножить на шесть тоже двенадцать. Значит два и шесть тоже делители.
4. Три умножить на четыре снова двенадцать. Смотри, три и четыре встретились в середине. Вот и правило остановки. Как только левое дошло до правого, делители кончились. Дальше искать нечего.

**UZ**
1. Ikkinchi usul qiyinroq savolga javob beradi. Bitta songa bo'linadimi emas, balki sonning umuman qanday bo'luvchilari bor. Ularni juftlab qidiramiz.
2. Birinchi juftlik har qanday sonda bor. Bu bir va sonning o'zi. Bir karra o'n ikki o'n ikki. Demak bir ham, o'n ikki ham bo'luvchi. Ikkalasi qatorga o'tadi.
3. Keyin tartib bilan sinaymiz. Ikki va olti. Ikki karra olti ham o'n ikki. Demak ikki va olti ham bo'luvchi.
4. Uch karra to'rt yana o'n ikki. Qarang, uch va to'rt o'rtada uchrashdi. Mana to'xtash qoidasi. Chap o'ngga yetdi, demak bo'luvchilar tugadi. Boshqa qidirishga hech narsa yo'q.

**EN**
1. The second method answers a harder question. Not whether it divides by one number, but what divisors the number has at all. We look for them in pairs.
2. Every number has the first pair. It is one and the number itself. One times twelve is twelve. So both one and twelve are divisors. Both move into the row.
3. Then we try in order. Two and six. Two times six is twelve as well. So two and six are divisors too.
4. Three times four is twelve again. Look, three and four met in the middle. Here is the stopping rule. Once the left one reaches the right one, the divisors have run out. There is nothing more to look for.

---

## Экран 6 — ОБЪЯСНЕНИЕ 4. РЕШАЕМ ВМЕСТЕ: все делители 24

### Экран

| Ключ | RU | UZ | EN |
|---|---|---|---|
| eyebrow | Решаем вместе | Birga yechamiz | Solving together |
| title | Найти все делители числа 24 | 24 sonining barcha bo'luvchilarini topish | Find every divisor of 24 |
| lead | Записываю каждый шаг. Ничего не стираю. | Har bir qadamni yozib boraman. Hech narsani o'chirmayman. | I write down every step and erase nothing. |
| row_1 | 24 : 1 = 24 → 1 и 24 | 24 : 1 = 24 → 1 va 24 | 24 : 1 = 24 → 1 and 24 |
| row_2 | 24 : 2 = 12 → 2 и 12 | 24 : 2 = 12 → 2 va 12 | 24 : 2 = 12 → 2 and 12 |
| row_3 | 24 : 3 = 8 → 3 и 8 | 24 : 3 = 8 → 3 va 8 | 24 : 3 = 8 → 3 and 8 |
| row_4 | 24 : 4 = 6 → 4 и 6 | 24 : 4 = 6 → 4 va 6 | 24 : 4 = 6 → 4 and 6 |
| row_5 | 24 : 5 = 4, остаток 4 → пары нет | 24 : 5 = 4, qoldiq 4 → juftlik yo'q | 24 : 5 = 4, remainder 4 → no pair |
| row_6 | 24 : 6 = 4 → встретились, стоп | 24 : 6 = 4 → uchrashdi, to'xtaymiz | 24 : 6 = 4 → they met, stop |
| answer | Ответ: 1, 2, 3, 4, 6, 8, 12, 24 — восемь делителей | Javob: 1, 2, 3, 4, 6, 8, 12, 24 — sakkizta bo'luvchi | Answer: 1, 2, 3, 4, 6, 8, 12, 24 — eight divisors |

### Два шага, которые делает ученик

**Шаг ученика 1** (после строки 4)

| Ключ | RU | UZ | EN |
|---|---|---|---|
| q5 | Делится ли 24 на 5 без остатка? | 24 soni 5 ga qoldiqsiz bo'linadimi? | Does 24 divide by 5 with no remainder? |
| opt_yes | Да | Ha | Yes |
| opt_no | Нет | Yo'q | No |

Верно — «Нет».
- `wrong_yes`: 24 : 5 = 4, и 4 в остатке. Пятёрка пары не даёт.
- `audio_hint_yes`: Двадцать четыре разделить на пять это четыре и четыре в остатке. Остаток не ноль, значит пятёрка делителем не будет.
- UZ `audio_hint_yes`: Yigirma to'rtni beshga bo'lsak to'rt chiqadi va to'rt qoldiq qoladi. Qoldiq nol emas, demak besh bo'luvchi bo'lolmaydi.
- EN `audio_hint_yes`: Twenty four divided by five is four with a remainder of four. The remainder is not zero, so five will not be a divisor.

**Шаг ученика 2** (после строки 6)

| Ключ | RU | UZ | EN |
|---|---|---|---|
| q_stop | На числе 6 пара дала 4. Что делаем дальше? | 6 da juftlik 4 ni berdi. Endi nima qilamiz? | At 6 the pair gave 4. What do we do next? |
| opt_stop_a | Останавливаемся: левое догнало правое | To'xtaymiz: chap o'ngga yetdi | Stop: the left one caught the right one |
| opt_stop_b | Продолжаем до 24 | 24 gacha davom etamiz | Keep going up to 24 |
| opt_stop_c | Продолжаем до 12 | 12 gacha davom etamiz | Keep going up to 12 |

Верно — первый.
- `wrong_b`: Дальше пойдут те же пары, только наоборот: 8 и 3, 12 и 2, 24 и 1. Новых делителей не будет.
- `audio_hint_b`: Дальше пойдут те же самые пары, только задом наперёд. Восемь и три, двенадцать и два. Новых делителей они не дадут, работа будет впустую.
- `wrong_c`: 12 уже записано в паре с 2. Пары начали повторяться на шестёрке.
- `audio_hint_c`: Двенадцать уже записано в паре с двойкой. Повторение началось на шестёрке, значит там и остановка.

**UZ разборы**
- `wrong_b`: Keyin o'sha juftliklar teskari tartibda keladi: 8 va 3, 12 va 2, 24 va 1. Yangi bo'luvchi chiqmaydi.
- `audio_hint_b`: Keyin o'sha juftliklarning o'zi teskari tartibda keladi. Sakkiz va uch, o'n ikki va ikki. Ular yangi bo'luvchi bermaydi, mehnat behuda ketadi.
- `wrong_c`: 12 allaqachon 2 bilan juftlikda yozilgan. Juftliklar oltida takrorlana boshladi.
- `audio_hint_c`: O'n ikki allaqachon ikki bilan juftlikda yozilgan. Takrorlanish oltida boshlandi, demak to'xtash ham shu yerda.

**EN разборы**
- `wrong_b`: The same pairs come next, only reversed: 8 and 3, 12 and 2, 24 and 1. No new divisors appear.
- `audio_hint_b`: The very same pairs come next, only backwards. Eight and three, twelve and two. They give no new divisors, the work would be wasted.
- `wrong_c`: 12 is already written in the pair with 2. The pairs started repeating at six.
- `audio_hint_c`: Twelve is already written in the pair with two. The repeating started at six, so that is where we stop.

### Озвучка

**RU**
1. Теперь решим целиком, от начала до конца. Найдём все делители двадцати четырёх. Я записываю каждый шаг и ничего не стираю, чтобы ты видел весь путь.
2. Начинаю с первой пары, она есть всегда. Единица и двадцать четыре.
3. Двойка. Двадцать четыре разделить на два двенадцать. Пара есть. Тройка. Восемь. Пара есть. Четвёрка. Шесть. Пара есть.
4. Теперь пятёрка. Как думаешь, разделится?
5. Не разделилась, остаток четыре. Смотри, я всё равно записал эту строку. Неудачный шаг тоже часть решения, его не прячут.
6. Шестёрка. Двадцать четыре разделить на шесть четыре. Но четвёрка уже есть в списке. Левое догнало правое.
7. Ответ. Единица, два, три, четыре, шесть, восемь, двенадцать, двадцать четыре. Восемь делителей.

**UZ**
1. Endi boshidan oxirigacha to'liq yechamiz. Yigirma to'rtning barcha bo'luvchilarini topamiz. Men har bir qadamni yozib boraman va hech narsani o'chirmayman, siz butun yo'lni ko'rib turing.
2. Birinchi juftlikdan boshlayman, u doim bor. Bir va yigirma to'rt.
3. Ikki. Yigirma to'rtni ikkiga bo'lsak o'n ikki. Juftlik bor. Uch. Sakkiz. Juftlik bor. To'rt. Olti. Juftlik bor.
4. Endi besh. Sizningcha, bo'linadimi?
5. Bo'linmadi, qoldiq to'rt. Qarang, men bu qatorni baribir yozdim. Muvaffaqiyatsiz qadam ham yechimning bir qismi, uni yashirmaydilar.
6. Olti. Yigirma to'rtni oltiga bo'lsak to'rt. Lekin to'rt ro'yxatda bor. Chap o'ngga yetdi.
7. Javob. Bir, ikki, uch, to'rt, olti, sakkiz, o'n ikki, yigirma to'rt. Sakkizta bo'luvchi.

**EN**
1. Now we solve one all the way through. We find every divisor of twenty four. I write down each step and erase nothing, so you can see the whole path.
2. I start with the first pair, it is always there. One and twenty four.
3. Two. Twenty four divided by two is twelve. There is a pair. Three. Eight. There is a pair. Four. Six. There is a pair.
4. Now five. What do you think, will it divide?
5. It did not, the remainder is four. Look, I wrote that line down anyway. A failed step is part of the solution too, we do not hide it.
6. Six. Twenty four divided by six is four. But four is already on the list. The left one caught the right one.
7. The answer. One, two, three, four, six, eight, twelve, twenty four. Eight divisors.

---

## Экран 7 — ОБЪЯСНЕНИЕ 5. СПОСОБ 3: кратные и якорь

### Экран

| Ключ | RU | UZ | EN |
|---|---|---|---|
| eyebrow | Способ 3 | 3-usul | Method 3 |
| title | Бесконечно и конечно | Cheksiz va sanoqli | Endless and countable |
| method_title | Способ 3. Получить кратные | 3-usul. Karrali sonlarni hosil qilish | Method 3. Get the multiples |
| step_mul | Умножай число на 1, 2, 3 и дальше | Sonni 1, 2, 3 va keyingilariga ko'paytiring | Multiply the number by 1, 2, 3 and on |
| cap_mult | Кратные числа 3 | 3 ga karrali sonlar | Multiples of 3 |
| cap_div | Делители числа 12 | 12 ning bo'luvchilari | Divisors of 12 |
| cap_a_done | Как далеко ни уехать, следующее кратное всегда есть. Их бесконечно много. | Qancha uzoqqa borilmasin, keyingi karrali son doim bor. Ular cheksiz ko'p. | However far the line runs on, the next multiple is always there. There are infinitely many. |
| cap_b_done | Делителей ровно шесть. | Bo'luvchilar roppa rosa oltita. | There are exactly six divisors. |
| wall | Дальше делителей нет. | Bundan keyin bo'luvchi yo'q. | No divisors beyond this point. |
| anchor_left | делители — до числа, их конечное число | bo'luvchilar — songacha, ular sanoqli | divisors come before the number and they run out |
| anchor_right | кратные — от числа и дальше, без конца | karrali sonlar — sondan boshlab, cheksiz | multiples start at the number and never end |
| metro | Поезд метро каждые 6 минут: 8:00, 8:06, 8:12 — это кратные шести. | Metro poyezdi har 6 daqiqada: 8:00, 8:06, 8:12 — bular oltiga karrali. | A metro train every 6 minutes: 8:00, 8:06, 8:12 — these are multiples of six. |
| final | Кратных бесконечно много, делителей — конечное число. | Karrali sonlar cheksiz ko'p, bo'luvchilar esa sanoqli. | There are infinitely many multiples, but only a finite number of divisors. |

### Озвучка

**RU**
1. Третий способ отвечает на обратный вопрос. Не какие делители у числа, а какие числа ему кратны. И тут всё просто. Умножай своё число на один, на два, на три и дальше.
2. Смотри. Три умножить на один три. На два шесть. На три девять. Прямая едет дальше, и следующее кратное найдётся всегда. Кратных бесконечно много. Так ходит метро. Поезд каждые шесть минут, и он не кончается.
3. А теперь делители двенадцати. Один, два, три, четыре, шесть, двенадцать. И всё, дальше стена. Их ровно шесть.
4. Вот главное, что стоит запомнить на весь год. Делители стоят до числа и кончаются. Кратные начинаются от числа и не кончаются никогда.

**UZ**
1. Uchinchi usul teskari savolga javob beradi. Sonning bo'luvchilari qanday emas, balki qaysi sonlar unga karrali. Bu yerda hammasi oson. O'z soningizni birga, ikkiga, uchga va keyingilariga ko'paytiravering.
2. Qarang. Uch karra bir uch. Uch karra ikki olti. Uch karra uch to'qqiz. Chiziq oldinga suriladi va keyingi karrali son doim topiladi. Karrali sonlar cheksiz ko'p. Metro ham shunday yuradi. Poyezd har olti daqiqada keladi va u tugamaydi.
3. Endi o'n ikkining bo'luvchilari. Bir, ikki, uch, to'rt, olti, o'n ikki. Tamom, keyin devor. Ular roppa rosa oltita.
4. Mana butun yilga eslab qolish kerak bo'lgan asosiy narsa. Bo'luvchilar songacha turadi va tugaydi. Karrali sonlar sondan boshlanadi va hech qachon tugamaydi.

**EN**
1. The third method answers the opposite question. Not what divisors a number has, but which numbers are multiples of it. And here it is simple. Multiply your number by one, by two, by three and on.
2. Watch. Three times one is three. Times two is six. Times three is nine. The line rolls on and the next multiple is always found. There are infinitely many multiples. That is how the metro runs. A train every six minutes, and it never stops coming.
3. Now the divisors of twelve. One, two, three, four, six, twelve. That is all, then a wall. There are exactly six.
4. Here is the main thing to remember for the whole year. Divisors stand before the number and they run out. Multiples start at the number and never end.

---

## Экран 8 — ПРАВИЛО. Вывод формулы

### Экран

| Ключ | RU | UZ | EN |
|---|---|---|---|
| eyebrow | Правило | Qoida | Rule |
| title | Два названия одного деления | Bitta bo'lishning ikki nomi | Two names for one division |
| rule_1 | Если a делится на b без остатка, то b называют делителем числа a. | Agar a soni b ga qoldiqsiz bo'linsa, b soni a sonining bo'luvchisi deyiladi. | If a divides by b with no remainder, then b is called a divisor of a. |
| rule_2 | В том же самом примере a называют кратным числа b. | Xuddi shu misolning o'zida a soni b sonining karralisi deyiladi. | In the very same example a is called a multiple of b. |
| example | a = 12, b = 3, 12 : 3 = 4 | a = 12, b = 3, 12 : 3 = 4 | a = 12, b = 3, 12 : 3 = 4 |
| hook_back | Теперь понятно, почему у Дилнозы вышло, а у Азиза нет: 24 : 6 = 4 без остатка, а 24 : 5 = 4 и 4 в остатке. | Endi Dilnozaniki nega chiqdi va Azizniki nega chiqmadi, tushunarli: 24 : 6 = 4, qoldiq yo'q, 24 : 5 = 4 esa 4 qoldiq beradi. | Now it is clear why Dilnoza succeeded and Aziz did not: 24 : 6 = 4 with no remainder, while 24 : 5 = 4 with a remainder of 4. |

### Озвучка

**RU**
1. Запомним правило. Если a делится на b без остатка, то b называют делителем числа a. А в том же самом примере a называют кратным числа b. Одно деление, два названия.
2. Буквы не должны пугать. Поставь вместо a двенадцать, вместо b три, и получишь то, с чего мы начали.
3. И вернёмся к самому началу урока. Теперь понятно, почему у Дилнозы команды сошлись, а у Азиза четверо остались без места. Двадцать четыре делится на шесть без остатка, а на пять с остатком четыре.

**UZ**
1. Qoidani eslab qolamiz. Agar a soni b ga qoldiqsiz bo'linsa, b soni a sonining bo'luvchisi deyiladi. Xuddi shu misolning o'zida a soni b sonining karralisi deyiladi. Bitta bo'lish, ikkita nom.
2. Harflardan qo'rqmang. a o'rniga o'n ikkini, b o'rniga uchni qo'ying va biz boshlagan narsani olasiz.
3. Endi darsning eng boshiga qaytamiz. Dilnozaning jamoalari nega tekis chiqdi va Azizning to'rt kishisi nega joysiz qoldi, endi tushunarli. Yigirma to'rt oltiga qoldiqsiz bo'linadi, beshga esa to'rt qoldiq bilan bo'linadi.

**EN**
1. Let us remember the rule. If a divides by b with no remainder, then b is called a divisor of a. And in the very same example a is called a multiple of b. One division, two names.
2. Do not let the letters scare you. Put twelve in place of a and three in place of b, and you get what we started with.
3. And back to the very beginning of the lesson. Now it is clear why Dilnoza's teams came out even and four of Aziz's players were left without a place. Twenty four divides by six with no remainder, and by five with a remainder of four.

---

## Экран 9 — ПРАКТИКА 1. Назови роли. Три задания

Общее для экрана.

| Ключ | RU | UZ | EN |
|---|---|---|---|
| eyebrow | Практика | Mashq | Practice |
| title | Назови каждое число | Har bir sonni nomlang | Name each number |
| lead | Делитель не больше самого числа, кратное — не меньше. | Bo'luvchi sondan katta emas, karrali son esa kichik emas. | A divisor is not larger than the number, a multiple is not smaller. |
| opt_mult | кратное | karralisi | multiple |
| opt_div | делитель | bo'luvchisi | divisor |

**Задание 1.** 20 : 5 = 4 · «20 — это … числа 5» → кратное · «5 — это … числа 20» → делитель
**Задание 2.** 18 : 3 = 6 · «18 — это … числа 3» → кратное · «3 — это … числа 18» → делитель
**Задание 3.** 35 : 7 = 5 · «35 — это … числа 7» → кратное · «7 — это … числа 35» → делитель

**Разборы (общие на все три задания)**
- `wrong_swap` RU: Перепутано местами. Делитель не больше самого числа. Меньшее число делит, большее делится.
- `audio_hint_swap` RU: Перепутано местами. Делитель не бывает больше самого числа. Меньшее делит, большее делится.
- `wrong_same` RU: Оба названия одинаковые не бывают. Одно деление даёт два разных имени.
- `audio_hint_same` RU: Оба названия одинаковыми не бывают. Одно деление даёт два разных имени.

UZ:
- `wrong_swap`: O'rni almashib ketdi. Bo'luvchi sonning o'zidan katta bo'lmaydi. Kichigi bo'ladi, kattasi bo'linadi.
- `audio_hint_swap`: O'rni almashib ketdi. Bo'luvchi sonning o'zidan katta bo'lmaydi. Kichigi bo'ladi, kattasi bo'linadi.
- `wrong_same`: Ikkala nom bir xil bo'lmaydi. Bitta bo'lish ikkita har xil nom beradi.
- `audio_hint_same`: Ikkala nom bir xil bo'lmaydi. Bitta bo'lish ikkita har xil nom beradi.

EN:
- `wrong_swap`: They are swapped. A divisor is never larger than the number itself. The smaller one divides, the larger one is divided.
- `wrong_same`: The two names are never the same. One division gives two different names.

### Озвучка
- intro RU: Три примера подряд. В каждом назови оба числа. Подсказка держится в голове. Делитель не больше самого числа, кратное не меньше.
- intro UZ: Ketma-ket uchta misol. Har birida ikkala sonni nomlang. Yodda tuting. Bo'luvchi sondan katta emas, karrali son esa kichik emas.
- intro EN: Three examples in a row. Name both numbers in each. Keep the clue in mind. A divisor is not larger than the number, a multiple is not smaller.
- on_correct RU: Верно. Меньшее делит, большее кратно.
- on_wrong RU: Посмотри разбор и попробуй ещё раз.

---

## Экран 10 — ПРАКТИКА 2. Способ 1 в деле. Четыре задания

| Ключ | RU | UZ | EN |
|---|---|---|---|
| eyebrow | Практика | Mashq | Practice |
| title | Делится или нет | Bo'linadimi yoki yo'q | Does it divide or not |
| lead | Ответь да или нет, потом набери остаток. | Ha yoki yo'q deb javob bering, keyin qoldiqni tering. | Answer yes or no, then type the remainder. |

**Задание 1.** 91 конфета, 7 детей. Раздать поровну выйдет? → **да**, 91 : 7 = 13, остаток 0.
- `wrong` RU: 91 : 7 = 13 ровно. Остаток ноль, значит поровну выходит.
- `audio_hint` RU: Девяносто один разделить на семь тринадцать. Остаток ноль, значит поровну выходит.
- UZ: To'qson birni yettiga bo'lsak o'n uch. Qoldiq nol, demak teng bo'linadi.

**Задание 2.** Поезд каждые 6 минут. Число 45 кратно шести? → **нет**, 45 : 6 = 7, остаток 3.
- `wrong` RU: 45 : 6 = 7 и 3 в остатке. Три минуты лишние, поезда в это время нет.
- `audio_hint` RU: Сорок пять разделить на шесть семь и три в остатке. Три минуты лишние, поезда в это время нет.
- UZ: Qirq beshni oltiga bo'lsak yetti va uch qoldiq. Uch daqiqa ortiqcha, bu vaqtda poyezd yo'q.

**Задание 3.** 48 тетрадей на 8 стопок. Поровну? → **да**, 48 : 8 = 6, остаток 0.
- `wrong` RU: 48 : 8 = 6 ровно. По шесть тетрадей в стопке, лишних нет.
- `audio_hint` RU: Сорок восемь разделить на восемь шесть. По шесть тетрадей в стопке, лишних нет.
- UZ: Qirq sakkizni sakkizga bo'lsak olti. Har uyumda oltitadan daftar, ortiqchasi yo'q.

**Задание 4.** 50 разделить на 4 поровну? → **нет**, 50 : 4 = 12, остаток 2.
- `wrong` RU: 50 : 4 = 12 и 2 в остатке. Двум места не хватило.
- `audio_hint` RU: Пятьдесят разделить на четыре двенадцать и два в остатке. Двум места не хватило.
- UZ: Ellikni to'rtga bo'lsak o'n ikki va ikki qoldiq. Ikkitasiga joy yetmadi.

**Общая ошибка «остаток вместо частного»**
- `wrong_quotient` RU: Это частное, а не остаток. Частное — сколько раз уместилось, остаток — сколько лишних.
- `audio_hint_quotient` RU: Это частное, а не остаток. Частное показывает, сколько раз уместилось. Остаток показывает, сколько лишних.
- UZ: Bu bo'linma, qoldiq emas. Bo'linma necha marta joylashganini, qoldiq esa nechtasi ortganini ko'rsatadi.

### Озвучка
- intro RU: Четыре проверки по первому способу. Каждый раз дели и смотри на остаток, а не на то, красиво ли получилось.
- intro UZ: Birinchi usul bo'yicha to'rtta tekshiruv. Har safar bo'ling va natija chiroyli chiqdimi emas, qoldiqqa qarang.
- intro EN: Four checks using the first method. Each time divide and look at the remainder, not at how neat it looks.

---

## Экран 11 — ПРАКТИКА 3. Способ 2 в деле. Два задания

| Ключ | RU | UZ | EN |
|---|---|---|---|
| eyebrow | Практика | Mashq | Practice |
| title | Найди все делители | Barcha bo'luvchilarni toping | Find every divisor |

**Задание 1 — число 18, по шагам**

| Шаг | Вопрос RU | Ответ |
|---|---|---|
| 1 из 4 | Какая пара есть у любого числа? | 1 и 18 |
| 2 из 4 | 18 делится на 2? Назови пару. | 2 и 9 |
| 3 из 4 | 18 делится на 3? Назови пару. | 3 и 6 |
| 4 из 4 | Проверяем 4. Что делаем? | Останавливаемся: 18 на 4 не делится, а пары уже сошлись |

Ответ: 1, 2, 3, 6, 9, 18 — шесть делителей.

**Задание 2 — число 20, без подсказок.** Ответ: 1, 2, 4, 5, 10, 20 — шесть делителей.

**Разборы**
- `wrong_missed` RU: Одного делителя не хватает. Проверь парами: у каждого записанного числа должна быть пара.
- `audio_hint_missed` RU: Одного делителя не хватает. Проверь парами. У каждого записанного числа должна быть своя пара.
- `wrong_extra` RU: Одно число лишнее. Раздели и посмотри остаток: 18 : 4 = 4 и 2 в остатке.
- `audio_hint_extra` RU: Одно число лишнее. Раздели и посмотри остаток. Восемнадцать разделить на четыре четыре и два в остатке.
- `wrong_early` RU: Остановка рано. Пары ещё не встретились, проверь следующее число.
- `audio_hint_early` RU: Остановка слишком рано. Пары ещё не встретились, проверь следующее число по порядку.

UZ:
- `wrong_missed`: Bitta bo'luvchi yetishmayapti. Juftlab tekshiring: yozilgan har bir sonning jufti bo'lishi kerak.
- `wrong_extra`: Bitta son ortiqcha. Bo'ling va qoldiqqa qarang: 18 : 4 = 4, qoldiq 2.
- `wrong_early`: Erta to'xtadingiz. Juftliklar hali uchrashmadi, keyingi sonni tekshiring.

EN:
- `wrong_missed`: One divisor is missing. Check in pairs: every number you wrote must have a partner.
- `wrong_extra`: One number does not belong. Divide and look at the remainder: 18 : 4 = 4 with 2 left over.
- `wrong_early`: You stopped too early. The pairs have not met yet, check the next number.

### Озвучка
- intro RU: Теперь второй способ, целиком и сам. Первое число восемнадцать, я веду тебя по шагам. Второе двадцать, там уже без меня.
- intro UZ: Endi ikkinchi usul, to'liq va o'zingiz. Birinchi son o'n sakkiz, men sizni qadamma-qadam olib boraman. Ikkinchisi yigirma, u yerda mensiz.
- intro EN: Now the second method, all of it and on your own. The first number is eighteen and I guide you step by step. The second is twenty, and there you work alone.

---

## Экран 12 — ПРАКТИКА 4. Найди ошибку. Два задания

| Ключ | RU | UZ | EN |
|---|---|---|---|
| eyebrow | Практика | Mashq | Practice |
| title | Найди ошибку | Xatoni toping | Find the mistake |
| lead | Проверь чужое решение так же, как проверял бы своё. | Birovning yechimini o'zingiznikini tekshirgandek tekshiring. | Check someone else's work the way you would check your own. |

**Задание 1 — ловушка.** Азиз выписал делители 20: `1, 2, 4, 5, 10, 20`. Дилноза говорит, что одного не хватает. Кто прав?
Верно — **прав Азиз**, список полный.
- `wrong_dilnoza` RU: Список полный. Проверь парами: 1 и 20, 2 и 10, 4 и 5. Все три пары на месте.
- `audio_hint_dilnoza` RU: Список полный. Проверь парами. Один и двадцать, два и десять, четыре и пять. Все три пары на месте, пропуска нет.
- UZ `wrong_dilnoza`: Ro'yxat to'liq. Juftlab tekshiring: 1 va 20, 2 va 10, 4 va 5. Uchala juftlik ham joyida.
- EN `wrong_dilnoza`: The list is complete. Check in pairs: 1 and 20, 2 and 10, 4 and 5. All three pairs are there.

**Задание 2 — настоящая ошибка.** Азиз выписал делители 18: `1, 2, 3, 6, 18`. Какое число пропущено?
Верно — **9**.
- `wrong_4` RU: 18 : 4 = 4 и 2 в остатке. Четвёрка делителем не является.
- `audio_hint_4` RU: Восемнадцать разделить на четыре четыре и два в остатке. Четвёрка делителем не является.
- `wrong_12` RU: 12 больше 9, а 18 : 12 не делится нацело. Ищи пару к двойке.
- `audio_hint_12` RU: Восемнадцать на двенадцать нацело не делится. Ищи пару к двойке.
- `wrong_none` RU: Пропуск есть. У двойки пара девятка: 2 · 9 = 18, а девятки в списке нет.
- `audio_hint_none` RU: Пропуск есть. У двойки пара девятка. Два умножить на девять восемнадцать, а девятки в списке нет.

UZ:
- `wrong_4`: 18 : 4 = 4, qoldiq 2. To'rt bo'luvchi emas.
- `wrong_12`: 18 soni 12 ga butun bo'linmaydi. Ikkiga juft qidiring.
- `wrong_none`: Tushib qolgani bor. Ikkining jufti to'qqiz: 2 · 9 = 18, to'qqiz esa ro'yxatda yo'q.

EN:
- `wrong_4`: 18 : 4 = 4 with 2 left over. Four is not a divisor.
- `wrong_12`: 18 does not divide by 12 exactly. Look for the partner of two.
- `wrong_none`: Something is missing. The partner of two is nine: 2 · 9 = 18, and nine is not on the list.

### Озвучка
- intro RU: На экзамене пригодится не только решать, но и проверять. Азиз выписал два списка. В одном ошибка есть, в другом нет. Не спеши искать её там, где её нет.
- intro UZ: Imtihonda faqat yechish emas, tekshirish ham asqotadi. Aziz ikkita ro'yxat yozdi. Birida xato bor, ikkinchisida yo'q. Xato yo'q joyda uni qidirishga shoshilmang.
- intro EN: On the exam you need to check as well as solve. Aziz wrote two lists. One has a mistake, the other does not. Do not rush to find one where there is none.

---

## Экран 13 — ПРАКТИКА 5. ЗАДАЧА. Сетка фотографий

| Ключ | RU | UZ | EN |
|---|---|---|---|
| eyebrow | Задача | Masala | Word problem |
| title | Фотографии с турнира | Turnir suratlari | Photos from the tournament |
| lead | Фотографии выкладывают в школьную галерею одинаковыми рядами. | Suratlar maktab galereyasiga bir xil qatorlar qilib joylanadi. | The photos go into the school gallery in equal rows. |
| q1 | Фотографий 24. По скольку можно ставить в ряд, чтобы все ряды были полными? | Suratlar 24 ta. Barcha qatorlar to'la bo'lishi uchun nechtadan qo'yish mumkin? | There are 24 photos. How many per row can we set so that every row is full? |
| q2 | А если фотографий 25? | Suratlar 25 ta bo'lsa-chi? | And if there are 25 photos? |
| out_1 | Восемь раскладок: по 1, 2, 3, 4, 6, 8, 12, 24 | Sakkizta joylashuv: 1, 2, 3, 4, 6, 8, 12, 24 tadan | Eight layouts: 1, 2, 3, 4, 6, 8, 12, 24 per row |
| out_2 | Три раскладки: по 1, 5, 25. Квадратная одна — 5 на 5. | Uchta joylashuv: 1, 5, 25 tadan. Kvadrati bittasi — 5 ga 5. | Three layouts: 1, 5, 25 per row. Only one is square — 5 by 5. |
| done | Сколько делителей — столько и раскладок. | Nechta bo'luvchi bo'lsa, shuncha joylashuv bo'ladi. | As many divisors as there are, that many layouts. |
| square | Квадратная сетка получается, только когда число делится само на себя поровну: 5 · 5 = 25. | Kvadrat to'r faqat son o'ziga o'zi teng bo'lganda chiqadi: 5 · 5 = 25. | A square grid appears only when the number splits into two equal parts: 5 · 5 = 25. |

**Разборы**
- `wrong_6` RU: Забыты крайние. По одной в ряд и по двадцать четыре в ряд — тоже полные ряды. Единица и само число делители всегда.
- `audio_hint_6` RU: Забыты крайние раскладки. По одной в ряд это длинный столбец, по двадцать четыре в ряд это одна длинная лента. Ряды в обоих случаях полные, а единица и само число делители всегда.
- `wrong_pair` RU: По 3 в ряд и по 8 в ряд выглядят по-разному. Пара одна, а раскладки две.
- `audio_hint_pair` RU: По три в ряд и по восемь в ряд выглядят по-разному. Пара одна, а раскладки получаются две.
- `wrong_25more` RU: 25 на 2, на 3, на 4 не делится, везде остаток. Полные ряды дают только 1, 5 и 25.
- `audio_hint_25more` RU: Двадцать пять на два, на три, на четыре не делится, везде остаётся лишнее. Полные ряды дают только один, пять и двадцать пять.

UZ:
- `wrong_6`: Chetkilari esdan chiqdi. Bittadan qator ham, yigirma to'rttadan qator ham to'la qator. Bir va sonning o'zi doim bo'luvchi.
- `wrong_pair`: 3 tadan va 8 tadan qator har xil ko'rinadi. Juftlik bitta, joylashuv esa ikkita.
- `wrong_25more`: 25 soni 2 ga, 3 ga, 4 ga bo'linmaydi, hamma joyda qoldiq qoladi. To'la qatorni faqat 1, 5 va 25 beradi.

EN:
- `wrong_6`: The edge layouts were forgotten. One per row and twenty four per row are full rows too. One and the number itself are always divisors.
- `wrong_pair`: Three per row and eight per row look different. One pair, but two layouts.
- `wrong_25more`: 25 does not divide by 2, 3 or 4, something is always left over. Only 1, 5 and 25 give full rows.

### Озвучка

**RU**
1. Задача из жизни. Фотографии с турнира выкладывают в школьную галерею одинаковыми рядами. Фотографий двадцать четыре. По скольку можно ставить в ряд, чтобы ни один ряд не остался неполным?
2. Это тот же второй способ, только в другой одежде. Каждый делитель двадцати четырёх это своя раскладка. По одной в ряд получится длинный столбец. По двадцать четыре в ряд одна длинная лента. И то и другое ряды полные.
3. Всего восемь раскладок, потому что делителей у двадцати четырёх восемь. Сколько делителей, столько и раскладок.
4. А теперь двадцать пять фотографий. Здесь раскладок всего три, и только одна из них квадратная. Пять на пять. Так бывает, когда пара сходится сама с собой.

**UZ**
1. Hayotiy masala. Turnir suratlari maktab galereyasiga bir xil qatorlar qilib joylanadi. Suratlar yigirma to'rtta. Birorta qator to'la bo'lmay qolmasligi uchun nechtadan qo'yish mumkin?
2. Bu o'sha ikkinchi usul, faqat boshqa libosda. Yigirma to'rtning har bir bo'luvchisi o'z joylashuvi. Bittadan qo'ysak uzun ustun chiqadi. Yigirma to'rttadan qo'ysak bitta uzun lenta. Ikkalasida ham qatorlar to'la.
3. Jami sakkizta joylashuv, chunki yigirma to'rtning bo'luvchilari sakkizta. Nechta bo'luvchi bo'lsa, shuncha joylashuv.
4. Endi yigirma beshta surat. Bu yerda joylashuv atigi uchta va ulardan faqat bittasi kvadrat. Besh ga besh. Juftlik o'zi bilan o'zi uchrashganda shunday bo'ladi.

**EN**
1. A problem from life. Photos from the tournament go into the school gallery in equal rows. There are twenty four photos. How many per row can we set so that no row is left unfinished?
2. This is the second method again, just in different clothes. Every divisor of twenty four is a layout of its own. One per row gives a long column. Twenty four per row gives one long strip. In both cases the rows are full.
3. Eight layouts in all, because twenty four has eight divisors. As many divisors, that many layouts.
4. Now twenty five photos. Here there are only three layouts, and only one of them is square. Five by five. That happens when a pair meets itself.

---

## Экран 14 — ФИНАЛЬНЫЙ ТЕСТ. Панель из пяти заданий

| Ключ | RU | UZ | EN |
|---|---|---|---|
| eyebrow | Финал | Final | Final |
| intro_line | Пять заданий на весь урок. | Butun darsga beshta topshiriq. | Five tasks covering the whole lesson. |

**1. Набрать число.** Сколько делителей у числа 36? → **9**
- hint RU: Иди парами: 1 и 36, 2 и 18, 3 и 12, 4 и 9. Шестёрка идёт в паре сама с собой.
- hint UZ: Juftlab yuring: 1 va 36, 2 va 18, 3 va 12, 4 va 9. Olti o'zi bilan o'zi juft bo'ladi.

**2. Выбор.** Какое число кратно 7: 34, 42, 51, 60? → **42**
- `wrong_34` RU: 34 : 7 = 4 и 6 в остатке. · audio: Тридцать четыре разделить на семь четыре и шесть в остатке.
- `wrong_51` RU: 51 : 7 = 7 и 2 в остатке. · audio: Пятьдесят один разделить на семь семь и два в остатке.
- `wrong_60` RU: 60 : 7 = 8 и 4 в остатке. · audio: Шестьдесят разделить на семь восемь и четыре в остатке.
- UZ: 34 : 7 = 4, qoldiq 6. · 51 : 7 = 7, qoldiq 2. · 60 : 7 = 8, qoldiq 4.

**3. Выбор способа.** Нужно узнать, делится ли 91 на 7. Что быстрее?
- вариант A: выписать все делители 91 и посмотреть
- вариант B (верно): разделить 91 на 7 и посмотреть остаток
- вариант C: перечислять кратные 7, пока не дойдём до 91
- `wrong_A` RU: Это работа на пять минут ради одного вопроса. Все делители нужны, когда спрашивают про все.
- `audio_hint_A` RU: Это работа на пять минут ради одного вопроса. Все делители ищут тогда, когда про все и спрашивают.
- `wrong_C` RU: Это тринадцать шагов вместо одного деления.
- `audio_hint_C` RU: Это тринадцать шагов вместо одного деления. Способ рабочий, но самый длинный.
- UZ `wrong_A`: Bu bitta savol uchun besh daqiqalik ish. Barcha bo'luvchilar barchasi so'ralganda kerak bo'ladi.
- UZ `wrong_C`: Bu bitta bo'lish o'rniga o'n uchta qadam.

**4. Выбор.** У какого числа делителей нечётное количество: 12, 16, 18, 20? → **16**
- correct RU: 16 = 4 · 4. Пара сходится сама с собой, поэтому делителей нечётное число: 1, 2, 4, 8, 16.
- `wrong_12` RU: У 12 все пары разные: 1 и 12, 2 и 6, 3 и 4. Значит делителей чётное число.
- `audio_hint_12` RU: У двенадцати все пары разные. Один и двенадцать, два и шесть, три и четыре. Значит делителей чётное количество.
- `wrong_18` RU: У 18 пары 1 и 18, 2 и 9, 3 и 6 — все разные, делителей шесть.
- `wrong_20` RU: У 20 пары 1 и 20, 2 и 10, 4 и 5 — все разные, делителей шесть.
- UZ correct: 16 = 4 · 4. Juftlik o'zi bilan o'zi uchrashadi, shuning uchun bo'luvchilar toq sonda: 1, 2, 4, 8, 16.

**5. Задача.** Поезд метро идёт каждые 6 минут, первый в 8:00. Придёт ли поезд ровно в 8:45? → **нет**
- correct RU: 45 : 6 = 7 и 3 в остатке. Ближайшие поезда в 8:42 и 8:48.
- audio RU: Сорок пять разделить на шесть семь и три в остатке. Значит в это время поезда нет. Ближайшие приходят в восемь сорок два и в восемь сорок восемь.
- `wrong_yes` RU: 45 на 6 нацело не делится. Кратные шести это 42 и 48, а 45 между ними.
- `audio_hint_yes` RU: Сорок пять на шесть нацело не делится. Кратные шести это сорок два и сорок восемь, а сорок пять стоит между ними.
- UZ correct: 45 : 6 = 7, qoldiq 3. Eng yaqin poyezdlar 8:42 va 8:48 da keladi.

**Карточка «Знаешь ли ты»** — про дюжину, переносится из текущего урока.

### Озвучка
- intro RU: Финальная проверка. Пять заданий на весь урок. Оценки не будет, но каждое задание разберём.
- intro UZ: Yakuniy tekshiruv. Butun darsga beshta topshiriq. Baho qo'yilmaydi, lekin har bir topshiriqni tahlil qilamiz.
- intro EN: The final check. Five tasks covering the whole lesson. There is no mark, but we will go through each one.

---

## Экран 15 — ИТОГ

| Ключ | RU | UZ | EN |
|---|---|---|---|
| eyebrow | Итог | Yakun | Result |
| praise | Урок пройден | Dars o'tildi | Lesson finished |
| cando | Ты научился находить делители и кратные любого числа. | Siz har qanday sonning bo'luvchilari va karralilarini topishni o'rgandingiz. | You have learned to find the divisors and multiples of any number. |
| rule_recap | Если a делится на b без остатка, то b — делитель числа a, а a — кратное числа b. | Agar a soni b ga qoldiqsiz bo'linsa, b — a ning bo'luvchisi, a — b ning karralisi. | If a divides by b with no remainder, then b is a divisor of a and a is a multiple of b. |
| memo_title | Три способа | Uchta usul | Three methods |
| memo_1_q | Проверить одно число | Bitta sonni tekshirish | Check one number |
| memo_1_a | раздели, смотри остаток | bo'ling, qoldiqqa qarang | divide, look at the remainder |
| memo_2_q | Найти все делители | Barcha bo'luvchilarni topish | Find every divisor |
| memo_2_a | иди парами до встречи | juftlab uchrashguncha yuring | go in pairs until they meet |
| memo_3_q | Получить кратные | Karrali sonlarni hosil qilish | Get the multiples |
| memo_3_a | умножай на 1, 2, 3 и дальше | 1, 2, 3 va keyingilariga ko'paytiring | multiply by 1, 2, 3 and on |
| conn_label_refs | Опирается на | Tayanadi | Builds on |
| conn_refs | таблицу умножения и деление с остатком | ko'paytirish jadvali va qoldiqli bo'lish | the times table and division with a remainder |
| conn_label_next | Дальше | Keyingi | Next |
| conn_next | Урок 2: признаки делимости на 2, 5 и 10 — проверять можно будет вообще без деления | 2-dars: 2, 5 va 10 ga bo'linish alomatlari — bo'lmasdan ham tekshirsa bo'ladi | Lesson 2: the divisibility rules for 2, 5 and 10, checking without dividing at all |

### Озвучка

**RU**
Урок пройден. Ты научился находить делители и кратные любого числа. Запомни правило. Если a делится на b без остатка, то b это делитель числа a, а a это кратное числа b. И запомни три способа. Проверить одно число раздели и посмотри остаток. Найти все делители иди парами, пока они не встретятся. Получить кратные умножай на один, на два, на три и дальше. Всё это стоит на таблице умножения, которую ты знаешь с младших классов. В следующий раз научимся узнавать делимость на два, на пять и на десять вообще без деления.

**UZ**
Dars o'tildi. Siz har qanday sonning bo'luvchilari va karralilarini topishni o'rgandingiz. Qoidani eslab qoling. Agar a soni b ga qoldiqsiz bo'linsa, b bu a sonining bo'luvchisi, a esa b sonining karralisi. Uchta usulni ham yodda tuting. Bitta sonni tekshirish uchun bo'ling va qoldiqqa qarang. Barcha bo'luvchilarni topish uchun juftliklar uchrashguncha yuring. Karrali sonlarni hosil qilish uchun birga, ikkiga, uchga va keyingilariga ko'paytiring. Bularning hammasi siz kichik sinflardan biladigan ko'paytirish jadvaliga tayanadi. Keyingi safar ikkiga, beshga va o'nga bo'linishni umuman bo'lmasdan aniqlashni o'rganamiz.

**EN**
The lesson is finished. You have learned to find the divisors and multiples of any number. Remember the rule. If a divides by b with no remainder, then b is a divisor of a and a is a multiple of b. And remember the three methods. To check one number, divide and look at the remainder. To find every divisor, go in pairs until they meet. To get the multiples, multiply by one, by two, by three and on. All of this rests on the times table you have known since the lower grades. Next time we will learn to tell divisibility by two, five and ten without dividing at all.

---

## 17. Узбекские термины — DRAFT, требуют валидации

| RU | UZ (предложено) | Комментарий |
|---|---|---|
| делитель | bo'luvchi | уже используется в уроке, из учебника |
| кратное | karrali son | уже используется |
| остаток | qoldiq | уже используется |
| частное | bo'linma | **новое в этом уроке** (экран 10, разбор ошибки) |
| раскладка (сетка фото) | joylashuv | **новое**, бытовое слово, не термин |
| квадратная сетка | kvadrat to'r | **новое** |
| нечётное количество | toq sonda | **новое** в этом уроке |
| таблица умножения | ko'paytirish jadvali | стандартное |
| деление с остатком | qoldiqli bo'lish | стандартное |
| признак делимости | bo'linish alomati | из плана класса, урок 2 |

Все помеченные «новое» — предложение Claude, **требует валидации узбекским методистом
математики** перед сборкой.

---

## 18. Что дальше

Контент утверждается методистом. После утверждения — этап 3: сборка в
`src/components/grade6/Dars01.jsx`, затем этап 4: QA по критериям приёмки.

---

# Приложение. Снятый контент (2026-08-14)

Текст ниже написан и озвучен на трёх языках, но в уроке НЕ выводится. Он вырезан
из `src/components/grade6/Dars01.jsx`, чтобы следующий, кто откроет файл, не
правил строки, которых нет на экране. Хранится здесь, потому что готовый
трёхъязычный текст с озвучкой дороже, чем место в документе.

Что откуда:

- **`s7`** — практика «найди число, НЕ кратное 6». Экран снят при пересборке в 15
  экранов: его задание переехало на экран 10 в перечень из четырёх проверок.
- **`s8`** — «два делителя есть всегда» плюс введение простого числа. Экран снят
  там же. Сам факт в уроке остался: он стал шагом 1 Способа 2 на экране 5 и
  строкой «1 и само число — делители всегда» в итоге. Пропало только упоминание
  простого числа — если оно понадобится в уроке 2 или 3, текст готов.
- **Отдельные ключи** — остатки прежних вариантов: закрытые вопросы экрана 5,
  подписи двух прямых экрана 7 (заменены одной осью), блок «что дальше» из итога.

### s7

```js
  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    question: { ru: 'Найди число, которое НЕ кратно 6', uz: "6 ga karrali BO'LMAGAN sonni toping", en: 'Find the number that is NOT a multiple of 6' },
    lead: { ru: 'Три числа делятся на 6 без остатка, одно — нет.', uz: "Uchta son 6 ga qoldiqsiz bo'linadi, bittasi esa yo'q.", en: 'Three numbers divide by 6 with no remainder, one does not.' },
    items: [
      { num: '12' },
      { num: '18' },
      { num: '24' },
      { num: '28' }
    ],
    errorIdx: 3,
    correct_text: { ru: 'Верно. 28 : 6 = 4 и 4 в остатке. Остальные — 12, 18 и 24 — делятся на 6 нацело.', uz: "To'g'ri. 28 : 6 = 4 va 4 qoldiq. Qolganlari — 12, 18 va 24 — 6 ga butun bo'linadi.", en: 'Correct. 28 : 6 = 4 with a remainder of 4. The others, 12, 18 and 24, divide by 6 exactly.' },
    // wrong_N — KO'RINADIGAN matn (formula bilan). audio_hint_N — o'sha fikrning
    // TTS-toza varianti (raqam va belgilar so'z bilan); OddOneOut aynan uni o'qiydi.
    wrong_0: { ru: '12 = 6 · 2 — это кратное. Ищи число, которое на 6 нацело не делится.', uz: "12 = 6 · 2 — bu karrali son. 6 ga butun bo'linmaydigan sonni qidiring.", en: '12 = 6 · 2, so it is a multiple. Look for the number that does not divide by 6 exactly.' },
    audio_hint_0: { ru: 'Двенадцать это шесть умножить на два, значит кратное. Ищи число, которое на шесть нацело не делится.', uz: "O'n ikki bu olti karra ikki, demak karrali son. Oltiga butun bo'linmaydigan sonni qidiring.", en: 'Twelve is six times two, so it is a multiple. Look for the number that does not divide by six exactly.' },
    wrong_1: { ru: '18 = 6 · 3 — кратное. Проверь остальные числа делением на 6.', uz: "18 = 6 · 3 — karrali son. Qolgan sonlarni 6 ga bo'lib tekshiring.", en: '18 = 6 · 3, a multiple. Check the other numbers by dividing by 6.' },
    audio_hint_1: { ru: 'Восемнадцать это шесть умножить на три, значит кратное. Проверь остальные числа делением на шесть.', uz: "O'n sakkiz bu olti karra uch, demak karrali son. Qolgan sonlarni oltiga bo'lib tekshiring.", en: 'Eighteen is six times three, so it is a multiple. Check the other numbers by dividing by six.' },
    wrong_2: { ru: '24 = 6 · 4 — кратное. Пройди по таблице умножения на 6.', uz: "24 = 6 · 4 — karrali son. 6 ga ko'paytirish jadvalidan yuring.", en: '24 = 6 · 4, a multiple. Go through the six times table.' },
    audio_hint_2: { ru: 'Двадцать четыре это шесть умножить на четыре, значит кратное. Пройди по таблице умножения на шесть.', uz: "Yigirma to'rt bu olti karra to'rt, demak karrali son. Oltiga ko'paytirish jadvalidan yuring.", en: 'Twenty four is six times four, so it is a multiple. Go through the six times table.' },
    why: {
      ru: [
        'Ряд кратных числа 6: 6, 12, 18, 24, 30.',
        '12, 18 и 24 стоят в этом ряду — все они кратны шести.',
        '28 в ряд не попадает: оно между 24 и 30. Проверяем: 28 : 6 = 4 и 4 в остатке.'
      ],
      uz: [
        "6 ga karrali sonlar qatori: 6, 12, 18, 24, 30.",
        "12, 18 va 24 shu qatorda turibdi — hammasi oltiga karrali.",
        "28 qatorga tushmaydi: u 24 bilan 30 orasida. Tekshiramiz: 28 : 6 = 4 va 4 qoldiq."
      ],
      en: ['The row of multiples of 6: 6, 12, 18, 24, 30.', '12, 18 and 24 stand in that row, so all of them are multiples of six.', '28 does not land in the row: it sits between 24 and 30. Check it: 28 : 6 = 4 with a remainder of 4.']
    },
    audio: {
      intro: { ru: 'Считай в уме. Три числа делятся на шесть без остатка, а одно нет. Найди его.', uz: "Xayolan hisoblang. Uchta son oltiga qoldiqsiz bo'linadi, bittasi esa yo'q. Uni toping.", en: 'Count in your head. Three numbers divide by six with no remainder, one does not. Find it.' },
      on_correct: { ru: 'Верно. Двадцать восемь на шесть нацело не делится.', uz: "To'g'ri. Yigirma sakkiz oltiga butun bo'linmaydi.", en: 'Correct. Twenty eight does not divide by six exactly.' },
      on_wrong: { ru: 'Это кратное шести. Ищи дальше.', uz: "Bu son oltiga karrali. Yana qidiring.", en: 'That one is a multiple of six. Keep looking.' }
    }
  },
```

### s8

```js
  s8: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Два делителя есть всегда', uz: "Ikkita bo'luvchi doim bor", en: 'Two divisors are always there' },
    note_one: { ru: 'Любое натуральное число делится на 1 без остатка.', uz: "Har qanday natural son 1 ga qoldiqsiz bo'linadi.", en: 'Every natural number divides by 1 with no remainder.' },
    note_self: { ru: 'Любое натуральное число делится само на себя без остатка.', uz: "Har qanday natural son o'ziga o'zi qoldiqsiz bo'linadi.", en: 'Every natural number divides by itself with no remainder.' },
    note_prime: { ru: 'Поэтому 1 и само число всегда являются его делителями. Если других делителей нет, число называют простым.', uz: "Shuning uchun 1 va sonning o'zi doim uning bo'luvchilari bo'ladi. Boshqa bo'luvchisi bo'lmasa, son tub son deyiladi.", en: 'So 1 and the number itself are always its divisors. If there are no other divisors, the number is called prime.' },
    audio: {
      ru: [
        'Разделим двенадцать на один. Получается двенадцать, остатка нет. Так будет с любым натуральным числом.',
        'Теперь разделим двенадцать на само двенадцать. Получается один, и снова без остатка.',
        'Поэтому единица и само число всегда являются его делителями. Если у числа других делителей нет, его называют простым. Про простые числа будет отдельный урок.'
      ],
      uz: [
        "O'n ikkini birga bo'lamiz. O'n ikki chiqadi, qoldiq yo'q. Har qanday natural sonda shunday bo'ladi.",
        "Endi o'n ikkini o'n ikkining o'ziga bo'lamiz. Bir chiqadi, yana qoldiqsiz.",
        "Shuning uchun bir va sonning o'zi doim uning bo'luvchilari bo'ladi. Sonning boshqa bo'luvchisi bo'lmasa, u tub son deyiladi. Tub sonlar haqida alohida dars bo'ladi."
      ],
      en: ['Let us divide twelve by one. We get twelve, with no remainder. It works the same for every natural number.', 'Now let us divide twelve by twelve itself. We get one, again with no remainder.', 'That is why one and the number itself are always its divisors. If a number has no other divisors, it is called prime. There will be a separate lesson about prime numbers.']
    }
  },
```

### s_hook.pool_label

```js
    pool_label: { ru: 'Ждут распределения', uz: 'Taqsimlanishni kutmoqda', en: 'Waiting to be split' },
```

### s_hook.bench_label

```js
    bench_label: { ru: 'Скамейка', uz: 'Zaxira', en: 'Bench' },
```

### s2.num_a

```js
    num_a: '20', num_b: '5', num_r: '4',
```

### s4.rows_label

```js
    rows_label: { ru: 'Сколько рядов', uz: 'Nechta qator', en: 'How many rows' },
```

### s5.opt0

```js
    opt0: { ru: 'По 3, и 2 останутся лишними', uz: '3 tadan, 2 tasi ortib qoladi', en: '3 in each, and 2 are left over' },
```

### s5.opt1

```js
    opt1: { ru: 'По 3, лишних не останется', uz: '3 tadan, ortiqchasi qolmaydi', en: '3 in each, nothing left over' },
```

### s5.opt2

```js
    opt2: { ru: 'По 4, лишних не останется', uz: '4 tadan, ortiqchasi qolmaydi', en: '4 in each, nothing left over' },
```

### s5.opt3

```js
    opt3: { ru: 'По 2, и 6 останутся лишними', uz: '2 tadan, 6 tasi ortib qoladi', en: '2 in each, and 6 are left over' },
```

### s5.wrong_1

```js
    wrong_1: { ru: 'Без остатка не выйдет: 4 · 3 = 12, а у нас 14. Две штуки некуда деть поровну.', uz: "Qoldiqsiz chiqmaydi: 4 · 3 = 12, bizda esa 14 ta. Ikkitasini teng joylashning iloji yo'q.", en: 'It will not come out even: 4 · 3 = 12, but we have 14. There is no equal place for the two extras.' },
```

### s5.audio_hint_1

```js
    audio_hint_1: { ru: 'Без остатка не выйдет. Четыре умножить на три равно двенадцать, а у нас четырнадцать. Две штуки некуда деть поровну.', uz: "Qoldiqsiz chiqmaydi. To'rt karra uch o'n ikki, bizda esa o'n to'rtta. Ikkitasini teng joylashning iloji yo'q.", en: 'It will not come out even. Four times three is twelve, but we have fourteen. There is no equal place for the two extras.' },
```

### s5.wrong_2

```js
    wrong_2: { ru: '4 · 4 = 16 — это больше, чем 14. Столько не наберётся.', uz: "4 · 4 = 16 — bu 14 dan ko'p. Bunchasi yig'ilmaydi.", en: '4 · 4 = 16, which is more than 14. There are not that many.' },
```

### s5.audio_hint_2

```js
    audio_hint_2: { ru: 'Четыре умножить на четыре равно шестнадцать, а это больше четырнадцати. Столько не наберётся.', uz: "To'rt karra to'rt o'n olti, bu esa o'n to'rtdan ko'p. Bunchasi yig'ilmaydi.", en: 'Four times four is sixteen, and that is more than fourteen. There are not that many.' },
```

### s5.wrong_3

```js
    wrong_3: { ru: 'Остаток не может быть больше делителя: 6 больше 4. Значит, в каждую часть можно положить ещё.', uz: "Qoldiq bo'luvchidan katta bo'lolmaydi: 6 soni 4 dan katta. Demak, har qismga yana qo'shsa bo'ladi.", en: 'A remainder cannot be larger than the divisor: 6 is larger than 4. So more can go into each part.' },
```

### s5.audio_hint_3

```js
    audio_hint_3: { ru: 'Остаток не может быть больше делителя. Шесть больше четырёх. Значит, в каждую часть можно положить ещё.', uz: "Qoldiq bo'luvchidan katta bo'lolmaydi. Olti soni to'rtdan katta. Demak, har qismga yana qo'shsa bo'ladi.", en: 'A remainder cannot be larger than the divisor. Six is larger than four. So more can go into each part.' },
```

### s10.wall

```js
    wall: { ru: 'Дальше делителей нет.', uz: "Bundan keyin bo'luvchi yo'q.", en: 'No divisors beyond this point.' },
```

### s10.anchor_left

```js
    anchor_left: { ru: 'делители — до числа, их конечное число', uz: "bo'luvchilar — songacha, ular sanoqli", en: 'divisors come before the number and they run out' },
```

### s10.anchor_right

```js
    anchor_right: { ru: 'кратные — от числа и дальше, без конца', uz: "karrali sonlar — sondan boshlab, cheksiz", en: 'multiples start at the number and never end' },
```

### s14.main_1

```js
    main_1: { ru: 'Если a делится на b без остатка, то b — делитель числа a, а a — кратное числа b.', uz: "Agar a soni b ga qoldiqsiz bo'linsa, b — a sonining bo'luvchisi, a esa b sonining karralisi.", en: 'If a divides by b with no remainder, then b is a divisor of a, and a is a multiple of b.' },
```

### s14.main_2

```js
    main_2: { ru: 'У любого числа делители — 1 и оно само.', uz: "Har qanday sonning bo'luvchilari — 1 va sonning o'zi.", en: 'Every number has 1 and itself as divisors.' },
```

### s14.main_3

```js
    main_3: { ru: 'Кратных бесконечно много, а делителей — конечное число.', uz: "Karrali sonlar cheksiz ko'p, bo'luvchilar esa sanoqli.", en: 'There are infinitely many multiples, but only a finite number of divisors.' },
```

### s14.hook_close

```js
    hook_close: { ru: 'Одно деление, два прочтения — и это одна и та же мысль.', uz: "Bitta bo'lish, ikki o'qilish — bu bitta fikrning o'zi.", en: 'One division, two readings, and it is one and the same idea.' },
```

### s14.conn_label_refs

```js
    conn_label_refs: { ru: 'Опирается на', uz: 'Nimaga tayanadi', en: 'Builds on' },
```

### s14.conn_refs

```js
    conn_refs: { ru: 'деление с остатком и таблицу умножения', uz: "qoldiqli bo'lish va ko'paytirish jadvali", en: 'division with a remainder and the times tables' },
```

### s14.conn_label_next

```js
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi', en: 'Next' },
```

### s14.conn_next

```js
    conn_next: { ru: 'признаки делимости на 2, 5 и 10', uz: "2, 5 va 10 ga bo'linish alomatlari", en: 'the divisibility rules for 2, 5 and 10' },
```

### s_grid.wrong_25

```js
    wrong_25: { ru: '25 на 2, на 3, на 4 не делится, везде остаток. Полные ряды дают только 1, 5 и 25.', uz: "25 soni 2 ga, 3 ga, 4 ga bo'linmaydi, hamma joyda qoldiq qoladi. To'la qatorni faqat 1, 5 va 25 beradi.", en: '25 does not divide by 2, 3 or 4, something is always left over. Only 1, 5 and 25 give full rows.' },
```

### s_grid.wrong_25_audio

```js
    wrong_25_audio: { ru: 'Двадцать пять на два, на три, на четыре не делится, везде остаётся лишнее. Полные ряды дают только один, пять и двадцать пять.', uz: "Yigirma besh ikkiga, uchga, to'rtga bo'linmaydi, hamma joyda ortiqcha qoladi. To'la qatorni faqat bir, besh va yigirma besh beradi.", en: 'Twenty five does not divide by two, three or four, something is always left over. Only one, five and twenty five give full rows.' },
```
