# 10-SINF DARSLAR KONTENTI (этап 2)

Один общий файл на класс, как в 3 классе: каждый новый урок добавляется сюда разделом.
Сборка делается из этого документа.

Правила, действующие во всём файле:

- три языка равнозначны: одинаковые числа, формулы и верные ответы;
- RU — «ты», прошедшее время без привязки к полу; UZ — `siz`, латиница, апостроф только
  простой `'`; EN — нейтральный;
- **голос мужской**, `g = m`;
- озвучка шире экранного текста и **без символов**: ни `π`, ни `√`, ни `=`, ни `²`;
- один сегмент — одна мысль; сегмент звучит после шага ученика, а не по таймеру;
- маскотов и персонажей нет.

> **UZ-термины — draft, требуется валидация узбекским методистом математики:**
> `birlik aylana` (единичная окружность), `abssissa` / `ordinata`, `kvadratlar yig'indisi`,
> `bissektrisa`, `pi ning oltidan biri` (π/6 в озвучке), `uchning kvadrat ildizi` (√3).
> Особенно чтение дробей с π вслух — его надо подтвердить до сборки.

---

# Урок 3 — Тригонометрический круг · КОНТЕНТ (этап 2)

Скелет: `DARS03_SKELET.md`. Строка плана 3, файл `Dars03.jsx`, `lessonId` — тот же номер.

> **ВНИМАНИЕ: раздел частично устарел после решения методиста от 2026-08-06** (два типа
> слайда). Слайды 2–8 стали роликами: вопросов на них больше нет, вместо них кадры с
> озвучкой. Актуальные тексты кадров и озвучки лежат в `Dars03.jsx` и покадрово описаны в
> `DARS03_SKELET.md` §5.
>
> Что здесь ещё верно: разборы на неверные варианты (используются в тестах 9–14), заблуждения,
> правило слайда 8, тексты хука и итога, правила озвучки.
> Что здесь устарело: вопросы на слайдах 3, 4, 5, 6, 7 и их варианты — они убраны.
> **Раздел синхронизируется на этапе QA, до приёмки урока.**

**15 слайдов:** 1 хук · 2 опора · 3 радиус равен единице · 4 угол 45° · 5 углы 30° и 60° ·
6 осевые углы · 7 короткий вопрос · 8 **правило** · 9 таблица · 10 обратная задача ·
11 найди ошибку · 12 собери сам · 13 значение выражения · 14 финал · 15 итог.

Постоянный элемент экрана на всех слайдах: единичная окружность 300×300, подвижная точка,
над окружностью угол в двух записях, под окружностью пара координат.

---

## Слайд 1 — ХУК (прогноз, не оценивается)

**На экране**

- Надпись: RU «ТРИГОНОМЕТРИЧЕСКИЙ КРУГ» · UZ "TRIGONOMETRIK DOIRA" · EN "THE UNIT CIRCLE"
- Заголовок: RU «Какая запись описывает эту точку?» ·
  UZ "Qaysi yozuv shu nuqtani tasvirlaydi?" · EN "Which reading describes this point?"
  (изменён 2026-08-07: прежний «Одну точку прочитали двумя способами» утверждал, что обе
  записи относятся к одной точке, и толкал к неверному ответу «обе»)
- Окружность, точка на `60°`, две записи рядом: `(1/2; √3/2)` и `(√3/2; 1/2)`
- Вопрос: RU «Какая запись верна?» · UZ "Qaysi yozuv to'g'ri?" · EN "Which reading is correct?"

**Варианты** (порядок перемешивается при монтировании)

| id | RU | UZ | EN | Верно |
|---|---|---|---|---|
| a | первая | birinchisi | the first | ✓ |
| b | вторая | ikkinchisi | the second | |
| c | обе | ikkalasi ham | both | |
| d | ни одна | hech qaysisi | neither | |

Ни зелёного, ни жёлтого: это догадка до объяснения. После выбора в слоте:

RU «Запомним твой ответ. Сейчас проверим его самой окружностью.»
UZ "Javobingizni eslab qolamiz. Endi uni aylananing o'zi bilan tekshiramiz."
EN "Your answer is saved. Now the circle itself will check it."

**Аудио**

1. RU «Двое учеников поставили точку для угла в шестьдесят градусов и прочитали её координаты.
   Записи получились разные.»
   UZ "Ikki o'quvchi oltmish gradus burchak uchun nuqta qo'ydi va uning koordinatalarini o'qidi.
   Yozuvlar har xil chiqdi."
   EN "Two students marked the point for an angle of sixty degrees and read its coordinates.
   The two readings came out different."
2. RU «Как думаешь, какая запись верная? Пока просто предположи.»
   UZ "Sizningcha, qaysi yozuv to'g'ri? Hozircha shunchaki taxmin qiling."
   EN "Which reading do you think is correct? Just make a guess for now."

---

## Слайд 2 — ОПОРА (не оценивается)

> Раздел переписан 2026-08-09 под собранный слайд. Экран стал роликом: вопросов нет, есть
> шесть кадров одного живого чертежа плюс колонка записи, где вывод накапливается строка за
> строкой. Седьмой кадр отдаёт работу ученику. Выводятся **обе** функции: сначала синус,
> потом косинус, потом пара координат — это и есть мост к правилу слайда 8.

**Заголовок.** RU «Из треугольника в окружность» · UZ "Uchburchakdan aylanaga" ·
EN "From the triangle to the circle". Бровка: RU «ОПОРА» · UZ "TAYANCH" · EN "WHAT YOU KNOW".

**Чертёж — один на все кадры, он не подменяется.** Колесо обозрения, треугольник и единичная
окружность — это три состояния одной фигуры: центр, радиус к кабине и отрезок высоты стоят на
месте всё время, меняется только то, что вокруг них.

| Кадр | Что на чертеже | Что добавляется в колонку записи |
|---|---|---|
| 1 | колесо крутится непрерывно, кабина поднимается и опускается, за ней идут отрезок высоты и дуга угла | RU «высота = sin α» · UZ "balandlik = sin α" · EN "height = sin α" |
| 2 | обод, кабины, опора и земля гаснут **на своём месте**; те же три линии вырастают в треугольник — появляются основание, знак прямого угла, подписи `a`, `b`, `c` | `sin α = a / c` |
| 3 | треугольник сжимается: гипотенуза становится единицей, подпись `c` меняется на `1` | `c = 1`, затем `sin α = a / 1` |
| 4 | вокруг того же центра прорисовывается окружность радиуса 1 и оси | `sin α = a` — вывод кадра, зелёная |
| 5 | внимание переходит на горизонталь: радиус гаснет до серого (его длина уже известна), основание становится оранжевым — цветом косинуса | `cos α = b / c`, `cos α = b / 1`, `cos α = b` (зелёная) |
| 6 | от точки идёт пунктир к оси ординат, на обеих осях появляются засечки, над точкой — запись `(b; a)` | `cos α = b`, `sin α = a`, `точка = (cos α; sin α)` (зелёная) |
| 7 | ученик сам ставит точку на π/6 и π/2 | — |

Подпись «высота» на первом кадре стоит там же, где на втором появляется `a`: одна надпись
переходит в другую, и связь «высота кабины = катет `a`» видно без слов.

Зелёным на каждом кадре горит **ровно одна** строка — вывод именно этого кадра. На следующем
кадре она гаснет до обычной: там она уже опора, а не вывод.

**Аудио** (семь сегментов, по одному на кадр)

1. RU «Кабинка колеса обозрения поднимается. Её высота над серединой — это и есть синус угла
   поворота.»
   UZ "Charx kabinasi ko'tarilmoqda. Uning markazdan balandligi — burilish burchagining sinusi."
   EN "The Ferris wheel cabin rises. Its height above the centre is the sine of the turn angle."
2. RU «В восьмом классе синус был отношением: катет против угла делить на гипотенузу.»
   UZ "Sakkizinchi sinfda sinus NISBAT edi: burchak qarshisidagi katet bo'linadi gipotenuzaga."
   EN "In grade eight the sine was a ratio: the opposite leg over the hypotenuse."
3. RU «Сожмём треугольник так, чтобы гипотенуза стала единицей. Знаменатель исчез.»
   UZ "Uchburchakni shunday kichraytiramizki, gipotenuza birga aylansin. Maxraj yo'qoldi."
   EN "Shrink the triangle so the hypotenuse becomes one. The denominator is gone."
4. RU «Синус стал просто высотой точки. Определение не новое — это то же самое, с радиусом
   единица.»
   UZ "Sinus shunchaki nuqtaning balandligi bo'lib qoldi. Ta'rif YANGI emas — radiusi bir
   bo'lgan o'sha ta'rif."
   EN "The sine is simply the height of the point. The definition is not new: it is the same
   one, with radius one."
5. RU «Тот же треугольник. Теперь смотрим вдоль основания. Косинус это прилежащий катет,
   делённый на ту же единицу, поэтому косинус равен самому основанию.»
   UZ "O'sha uchburchak. Endi asos bo'ylab qaraymiz. Kosinus yondosh katet, u yana o'sha birga
   bo'linadi, shuning uchun kosinus asosning o'ziga teng."
   EN "The same triangle. Now look along the base. The cosine is the adjacent leg over that
   same one, so the cosine equals the base itself."
6. RU «Два числа готовы. Точка на окружности всегда записывается парой. Сначала косинус, потом
   синус.»
   UZ "Ikki son tayyor. Aylanadagi nuqta doim juftlik bilan yoziladi. Avval kosinus, keyin
   sinus."
   EN "Two numbers are ready. A point on the circle is always written as a pair. Cosine first,
   then sine."
7. RU «Теперь поставь точку сам. Радиан — это длина дуги, а не градус.»
   UZ "Endi nuqtani o'zingiz qo'ying. Radian — yoy uzunligi, gradus emas."
   EN "Now place the point yourself. A radian is an arc length, not a degree."

**Почему в записи есть строки `sin α = a / 1` и `cos α = b / 1`.** Без них переход от `a / c`
к `a` — фокус: ученик видит начало и конец, но не видит подстановку. Строка подстановки стоит
отдельно, и только после неё появляется зелёный вывод.

**Почему косинус выводится здесь, а не оставлен на правило.** До этой правки урок доказывал
только синус, а косинус впадал в готовом виде — сначала в показаниях прибора на слайде 3, потом
в правиле на слайде 8. Ученик видел, откуда взялась одна координата, и должен был поверить во
вторую. Вывод у них общий с точностью до буквы: та же гипотенуза, та же единица, другой катет.
Показать оба вывода стоит одного кадра, а «поверь» стоит непонятого правила.

---

## Слайды 3–7 — ПОКАЗ, ПОТОМ РАБОТА УЧЕНИКА

> Раздел переписан 2026-08-09 по решению методиста: «слайды 3–7 сделать по образцу слайда 2 —
> показать, как надо, и потом дать ученику сделать самому». Прежний текст описывал вопросы с
> вариантами, которых на этих экранах больше нет (решение от 2026-08-06: слайды 2–8 стали
> роликами). Прежняя редакция целиком перенесена в приложение в конце файла: разборы неверных
> вариантов оттуда используются в тестах 9–14 и при сборке следующих уроков блока Б1.

Общая форма всех пяти экранов одинакова и повторяет слайд 2:

1. **Показ.** Один-три кадра с озвучкой. Чертёж живой, справа колонка записи, куда строка за
   строкой ложится решение. Ученик ничего не нажимает.
2. **Работа.** Тот же чертёж становится рабочим: ученик ставит точку, ведёт её, набирает число.

Показ никогда не решает ту задачу, которую сейчас получит ученик, — иначе экран превращается в
списывание, а это нарушение §5.0 эталона. Он показывает **способ** на другом случае.

---

### Слайд 3 — ОТКРЫТИЕ. Почему счётчик не сходит с единицы (оценивается)

Бровка RU «ОТКРЫТИЕ» · UZ "KASHFIYOT" · EN "DISCOVERY".
Заголовок RU «Можно ли увести счётчик с единицы?»

**Показ — вывод основного тождества.** Чертёж: тот же треугольник в единичной окружности,
которым закончился слайд 2.

| Кадр | Запись |
|---|---|
| 1 | `b = cos α`, `a = sin α`, `c = 1` |
| 2 | добавляется `b² + a² = c²` |
| 3 | `b² + a² = 1²` → `cos²α + sin²α = 1` (зелёная) |

**Работа.** Ученик водит точку по трём четвертям и следит за счётчиком.
Итог: RU «Не уводится. Точка на окружности радиуса один, значит координата не бывает длиннее
единицы.»

**Аудио**

1. RU «Вернёмся к тому же треугольнику. Его катеты это косинус и синус, а гипотенуза это радиус,
   то есть единица.»
2. RU «Треугольник прямоугольный, значит работает теорема Пифагора: сумма квадратов катетов
   равна квадрату гипотенузы.»
3. RU «Подставим. Единица в квадрате это единица. Так и получается: квадрат косинуса плюс
   квадрат синуса всегда равен единице.»
4. RU «Теперь проверь это руками. Проведи точку по разным четвертям и следи за счётчиком.»
5. RU «Координаты меняются, а счётчик не двигается. Причину мы только что вывели.»

**Что изменилось и зачем.** Раньше счётчик был чёрным ящиком: он показывал единицу, а объяснение
сводилось к «потому что радиус такой». Тождество `cos²α + sin²α = 1` — главная формула урока, и
теперь она выводится из теоремы Пифагора, которую ученик знает с восьмого класса.

---

### Слайд 4 — ВЫВОДИМ. Половина угла — не половина координаты (оценивается)

**Показ — опровержение догадки, без выдачи ответа.** Чертёж: окружность с биссектрисой, точки
нет.

| Кадр | Запись |
|---|---|
| 1 | `догадка: cos 45° = 1/2`, `догадка: sin 45° = 1/2` (тёплым цветом — это догадка, а не запись) |
| 2 | добавляется `(1/2)² + (1/2)² = 1/4 + 1/4`, `= 1/2` |
| 3 | `1/2 ≠ 1` (тёплым) |

**Работа.** Ученик ставит точку ровно посередине между осями и видит 0,71. После верного
действия открывается вывод: `x = y`, `x² + x² = 1`, `2x² = 1`, `x = √2/2 ≈ 0,71`.

**Почему показ не выдаёт ответ.** Он проверяет догадку тождеством, выведенным на слайде 3, и
показывает, что одна вторая невозможна. Верное число ученик находит сам — показан **способ
проверки**, а не результат.

---

### Слайд 5 — ОТРАЖАЕМ. Тридцать и шестьдесят (оценивается)

**Показ — откуда берутся √3/2 и 1/2.** Чертёж: равносторонний треугольник со стороной 1,
высота делит его пополам.

| Кадр | Запись |
|---|---|
| 1 | `равносторонний треугольник со стороной 1`, `h делит основание пополам`, `1/2 + 1/2 = 1` |
| 2 | `h² + (1/2)² = 1²`, `h² = 1 − 1/4 = 3/4`, `h = √3/2` (зелёная) |

**Работа.** Ученик ставит точку на 30°, затем отражает её через биссектрису на 60° и сравнивает
две строки. Итог — вставка: `cos α = sin(90° − α)`.

**Что изменилось.** Вывод высоты был только в озвучке, на экране стоял рисунок без записи.
Теперь то, что произносится, одновременно пишется.

---

### Слайд 6 — ОСЕВЫЕ УГЛЫ (оценивается)

**Показ.** Два кадра о том, зачем понадобилась окружность: определение из треугольника работает
до 90°, а точка едет дальше — вот 120°, высота есть, треугольника нет. Третий кадр — **разобранный
образец**: самая левая точка.

| Кадр | Чертёж | Запись |
|---|---|---|
| 1–2 | прямоугольный треугольник упирается в 90°, точка уезжает на 120° | — |
| 3 | точка в 180°, координаты подписаны на чертеже | `самая левая точка`, `сдвиг вправо: целый радиус, влево`, `cos 180° = −1`, `sin 180° = 0` (зелёная) |

**Работа.** Ученик проходит **три оставшиеся** осевые точки: 0°, 90°, 270°. Точка 180° из
задания убрана — она уже разобрана как образец, и требовать её повторно значит просить списать.

---

### Слайд 7 — ЧЕГО НЕ БЫВАЕТ. Может ли sin α = 1,2 (оценивается)

**Показ — способ на числе, которое подходит.** Чертёж: окружность, горизонталь на высоте 0,6.

| Кадр | Запись |
|---|---|
| 2 | `sin α = 0,6`, `cos²α = 1 − 0,36`, `cos²α = 0,64`, `cos α = ± 0,8` (зелёная) |

**Работа.** Ученик пробует поднять точку до 1,2 и упирается в верх окружности, затем сам
считает `1 − 1,44 = −0,44`. Вывод: квадрат не бывает отрицательным, такого угла нет.

**Почему показ идёт на 0,6, а не на 1,2.** Ученику показывают дорогу, а не пункт назначения: тот
же способ на числе, которое проходит проверку. Если показать 1,2, задание исчезнет.

---

## Слайд 8 — ПРАВИЛО (не оценивается)

Карточка раскрывается **только после верного ответа на слайде 7**. Строки появляются по
очереди, интервал 0,18 с.

**Бейдж:** RU «ПРАВИЛО» · UZ "QOIDA" · EN "RULE"

**Строка 1**
RU «Точке угла α на единичной окружности отвечают координаты (cos α; sin α).»
UZ "Birlik aylanadagi α burchak nuqtasiga (cos α; sin α) koordinatalar mos keladi."
EN "The point of angle α on the unit circle has coordinates (cos α; sin α)."

**Строка 2**
RU «cos²α + sin²α = 1, поэтому оба значения лежат от −1 до 1.»
UZ "cos²α + sin²α = 1, shuning uchun ikkala qiymat minus birdan birgacha yotadi."
EN "cos²α + sin²α = 1, so both values lie between −1 and 1."

**Строка 3**
RU «Значения для π/6, π/4 и π/3 — это координаты трёх точек, а не список для заучивания.»
UZ "π/6, π/4 va π/3 uchun qiymatlar — uchta nuqtaning koordinatalari, yodlash uchun ro'yxat
emas."
EN "The values for π/6, π/4 and π/3 are the coordinates of three points, not a list to
memorise."

**Образец под карточкой:** берётся из учебника, часть II, Глава III «Элементарные функции и
уравнения», моноширинным шрифтом. **Точную страницу и формулировку вставить при сверке** —
текстовый слой в PDF битый, страница читается изображением.

**Аудио**

1. RU «Соберём всё, что увидели, в одну запись.»
   UZ "Ko'rgan hamma narsamizni bitta yozuvga yig'amiz."
   EN "Let us gather everything we saw into one statement."
2. RU «Координаты точки — это косинус и синус угла, именно в таком порядке.»
   UZ "Nuqtaning koordinatalari — burchakning kosinusi va sinusi, aynan shu tartibda."
   EN "The coordinates of the point are the cosine and the sine of the angle, in that order."
3. RU «Сумма их квадратов равна единице, поэтому ни одно из них не выходит за единицу.»
   UZ "Ularning kvadratlari yig'indisi birga teng, shuning uchun ularning hech biri birdan
   chiqmaydi."
   EN "The sum of their squares is one, so neither of them can exceed one."
4. RU «И самое важное. Таблицу трёх углов не надо помнить наизусть. Её можно восстановить,
   поставив точку.»
   UZ "Va eng muhimi. Uch burchak jadvalini yod bilish shart emas. Nuqta qo'yib, uni tiklash
   mumkin."
   EN "And the most important part. You do not need the table by heart. You can rebuild it by
   placing the point."

---

## Слайд 9 — ПРАКТИКА. Таблица трёх углов (оценивается)

**На экране**

- Таблица `π/6` · `π/4` · `π/3` с пустыми клетками для косинуса и синуса
- Ученик ставит точку и заполняет пару; строка проверяется радиусом

**Ответы:** `π/6 → (√3/2; 1/2)` · `π/4 → (√2/2; √2/2)` · `π/3 → (1/2; √3/2)`

**Разбор на неверную пару** (общий, привязан к введённым числам)
RU «Ставлю точку по твоим числам. Она сошла с окружности: сумма квадратов не равна единице.»
UZ "Sizning sonlaringiz bo'yicha nuqta qo'yaman. U aylanadan chiqib ketdi: kvadratlar
yig'indisi birga teng emas."
EN "I place the point from your numbers. It has left the circle: the sum of the squares is not
one."

**Разбор на перестановку координат** (З1/З5)
RU «Числа верные, но местами. Точка ушла на другой угол — посмотри, куда она встала.»
UZ "Sonlar to'g'ri, lekin o'rni almashgan. Nuqta boshqa burchakka ketdi — qayerga turganiga
qarang."
EN "The numbers are right but swapped. The point moved to a different angle — see where it
landed."

**Аудио**

1. RU «Три угла, три точки. Ставь точку и записывай пару.»
   UZ "Uch burchak, uch nuqta. Nuqta qo'ying va juftlikni yozing."
   EN "Three angles, three points. Place the point and write down the pair."
2. RU «Если пара неверная, точка сойдёт с окружности, и ты это увидишь.»
   UZ "Agar juftlik noto'g'ri bo'lsa, nuqta aylanadan chiqadi va siz buni ko'rasiz."
   EN "If the pair is wrong, the point leaves the circle and you will see it."

---

## Слайд 10 — ПРАКТИКА. Обратная задача (оценивается)

**На экране**

- Дано: ордината равна `1/2`. Ученик проводит горизонталь
- Вопрос: RU «Сколько точек подходит?» · UZ "Nechta nuqta mos keladi?" · EN "How many points
  fit?"

**Варианты и разбор**

| id | Текст | Верно | Разбор |
|---|---|---|---|
| a | две · ikkita · two | ✓ | RU «Да. Горизонталь пересекла окружность дважды, и обе точки подходят.» UZ "Ha. Gorizontal chiziq aylanani ikki marta kesdi va ikkala nuqta ham mos keladi." EN "Yes. The horizontal line crosses the circle twice, and both points fit." |
| b | одна · bitta · one | | RU «Проведи горизонталь до конца. Вторая точка уже подсвечена слева.» UZ "Gorizontal chiziqni oxirigacha o'tkazing. Ikkinchi nuqta chapda allaqachon yoritilgan." EN "Extend the line all the way. The second point is already highlighted on the left." |
| c | ни одной · birorta ham · none | | RU «Одна вторая меньше единицы, поэтому горизонталь до окружности достаёт.» UZ "Bir ikkidan birdan kichik, shuning uchun gorizontal chiziq aylanaga yetadi." EN "One half is less than one, so the line does reach the circle." |
| d | четыре · to'rtta · four | | RU «Горизонталь — прямая. У прямой с окружностью не бывает больше двух общих точек.» UZ "Gorizontal chiziq — to'g'ri chiziq. To'g'ri chiziq bilan aylananing ikkitadan ortiq umumiy nuqtasi bo'lmaydi." EN "The line is straight. A straight line meets a circle in at most two points." |

**Аудио**

1. RU «Теперь наоборот. Число известно, а угол нет.»
   UZ "Endi teskarisi. Son ma'lum, burchak esa yo'q."
   EN "Now the other way round. The number is known, the angle is not."
2. RU «Проведи прямую на этой высоте и посмотри, сколько раз она задела окружность.»
   UZ "Shu balandlikda to'g'ri chiziq o'tkazing va u aylanaga necha marta tekkanini ko'ring."
   EN "Draw a line at that height and see how many times it touches the circle."

> Слова «серия», «период» и «все решения» на этом слайде не звучат — это блок 2.

---

## Слайд 11 — ПРАКТИКА. Найди ошибку (оценивается)

**На экране** — готовая таблица из четырёх строк, ученик отмечает **первую** неверную:

| Строка | Запись | |
|---|---|---|
| 1 | `sin 0 = 0` | верно |
| 2 | `cos 45° = √2/2` | верно |
| 3 | `sin 60° = 1/2` | **ошибка**, координаты переставлены |
| 4 | `cos 90° = 0` | верно |

**После верного ответа** — доказательство точкой, а не словом:
RU «Ставлю точку по третьей строке. Она встала на тридцать градусов, а не на шестьдесят.»
UZ "Uchinchi qator bo'yicha nuqta qo'yaman. U oltmish emas, o'ttiz gradusga tushdi."
EN "I place the point from line three. It landed on thirty degrees, not sixty."

**Разбор на неверный выбор строки**
- строка 1: RU «Здесь всё сходится: точка на горизонтальной оси, вверх не поднялась.» UZ "Bu
  yerda hammasi to'g'ri: nuqta gorizontal o'qda, yuqoriga ko'tarilmagan." EN "This one holds:
  the point is on the horizontal axis and has not risen."
- строка 2: RU «Это биссектриса, мы её выводили на четвёртом экране.» UZ "Bu bissektrisa, biz
  uni to'rtinchi ekranda chiqargan edik." EN "That is the bisector; we derived it on screen
  four."
- строка 4: RU «Это верхняя точка. Вправо она не ушла, значит ноль.» UZ "Bu yuqori nuqta.
  O'ngga siljimagan, demak nol." EN "That is the top point. It has not moved right, so zero."

---

## Слайд 12 — ПРАКТИКА. Собери сам (оценивается)

**Задание**
RU «Поставь точку, у которой косинус отрицательный, а синус положительный.»
UZ "Kosinusi manfiy, sinusi musbat bo'lgan nuqta qo'ying."
EN "Place a point whose cosine is negative and whose sine is positive."

Проверка идёт по координатам, слово «четверть» не вводится — это урок 4.

**Разбор**
- точка справа вверху: RU «Синус верно, а вот косинус получился положительным. Уводи точку
  левее оси.» UZ "Sinus to'g'ri, lekin kosinus musbat chiqdi. Nuqtani o'qdan chaproqqa
  olib boring." EN "The sine is right, but the cosine came out positive. Move the point left
  of the axis."
- точка слева внизу: RU «Косинус верно, но точка опустилась ниже оси, и синус стал
  отрицательным.» UZ "Kosinus to'g'ri, lekin nuqta o'qdan pastga tushdi va sinus manfiy
  bo'ldi." EN "The cosine is right, but the point dropped below the axis and the sine turned
  negative."
- точка на оси: RU «На оси одно из чисел равно нулю, а нам нужны минус и плюс.» UZ "O'qda
  sonlardan biri nolga teng, bizga esa minus va plyus kerak." EN "On the axis one of the
  numbers is zero, and we need a minus and a plus."

---

## Слайд 13 — ПРАКТИКА. Значение выражения (оценивается)

**На экране** — `cos 60° + sin 30°`. Обе точки отмечены, нужные координаты подсвечены.

**Ответ:** `1/2 + 1/2 = 1`

| id | Текст | Верно | Разбор |
|---|---|---|---|
| a | 1 | ✓ | RU «Да. Обе координаты оказались одинаковыми, хотя углы разные.» UZ "Ha. Burchaklar har xil bo'lsa ham, ikkala koordinata bir xil chiqdi." EN "Yes. Both coordinates turned out equal even though the angles differ." |
| b | √3 | | RU «Это взяты не те координаты: у шестидесяти нужна первая, у тридцати — вторая.» UZ "Bu yerda boshqa koordinatalar olingan: oltmishda birinchisi, o'ttizda ikkinchisi kerak." EN "The wrong coordinates were taken: sixty needs the first, thirty needs the second." |
| c | (1 + √3)/2 | | RU «Одно значение верное, второе взято из соседней координаты. Посмотри, какая подсвечена.» UZ "Bitta qiymat to'g'ri, ikkinchisi qo'shni koordinatadan olingan. Qaysi biri yoritilganiga qarang." EN "One value is right, the other came from the neighbouring coordinate. See which one is highlighted." |
| d | 2 | | RU «Каждое из чисел равно одной второй, а не единице.» UZ "Sonlarning har biri bir ikkidan, bir emas." EN "Each of the numbers is one half, not one." |

**Аудио**

1. RU «Не вспоминай значения. Возьми их прямо с окружности.»
   UZ "Qiymatlarni eslashga urinmang. Ularni to'g'ridan-to'g'ri aylanadan oling."
   EN "Do not try to recall the values. Take them straight off the circle."

---

## Слайд 14 — ФИНАЛ. Три коротких подряд (оценивается)

Вопросы идут по очереди; отвеченный сжимается в строку «задание — ответ».

| № | Вопрос | Ответ | Разбор на частую ошибку |
|---|---|---|---|
| 1 | `sin 45°` | `√2/2` | взяли `√3/2` — это шестьдесят, точка выше |
| 2 | `cos 180°` | `−1` | взяли `1` — это точка справа, угол ноль |
| 3 | какой угол даёт точку `(0; −1)` | `3π/2` | назвали `π/2` — там точка вверху, а эта внизу |

**Аудио**

1. RU «Три коротких вопроса подряд. Каждый следующий откроется после верного ответа.»
   UZ "Ketma-ket uchta qisqa savol. Har keyingisi to'g'ri javobdan keyin ochiladi."
   EN "Three short questions in a row. Each next one opens after a correct answer."

---

## Слайд 15 — ИТОГ (не оценивается)

**На экране**

- Возврат к слайду 1: показывается ответ ученика и верный
- Строка вывода: RU «Три табличных угла — это три точки. Их координаты восстанавливаются из
  радиуса.» · UZ "Uchta jadval burchagi — bu uchta nuqta. Ularning koordinatalari radiusdan
  tiklanadi." · EN "The three table angles are three points. Their coordinates can be rebuilt
  from the radius."

**Аудио**

1. RU «В начале урока ты выбрал одну из двух записей. Вот что получилось.»
   UZ "Dars boshida siz ikki yozuvdan birini tanlagan edingiz. Mana nima bo'ldi."
   EN "At the start of the lesson you chose one of the two readings. Here is the outcome."
2. RU «Для шестидесяти градусов точка стоит высоко, поэтому вторая координата больше первой.»
   UZ "Oltmish gradus uchun nuqta baland turadi, shuning uchun ikkinchi koordinata birinchisidan
   katta."
   EN "For sixty degrees the point sits high, so the second coordinate is larger than the first."
3. RU «Таблицу можно не помнить. Достаточно поставить точку и прочитать два числа.»
   UZ "Jadvalni yodlash shart emas. Nuqta qo'yib, ikki sonni o'qish kifoya."
   EN "You do not have to remember the table. It is enough to place the point and read two
   numbers."

---

## Приложение. Слайды 3–7 до редакции 2026-08-09

Ниже — прежняя редакция этих экранов: вопрос с четырьмя вариантами и разбор на каждый неверный.
**Сами экраны так больше не устроены** (решения методиста от 2026-08-06 и 2026-08-09: ролик,
затем работа ученика). Раздел оставлен не как описание урока, а как банк формулировок:
заблуждения и разборы отсюда используются в тестовых экранах 9–14 и при сборке следующих уроков
блока Б1. Тексты не редактировались.

### Слайд 3 — ОТКРЫТИЕ. Радиус равен единице (оценивается)

**На экране**

- Надпись: RU «ОТКРЫТИЕ» · UZ "KASHFIYOT" · EN "DISCOVERY"
- Под окружностью счётчик: `x² + y²` — при любом положении точки показывает `1`
- Вопрос: RU «Что это значит для синуса и косинуса?» · UZ "Bu sinus va kosinus uchun nimani
  anglatadi?" · EN "What does this mean for sine and cosine?"

**Варианты и разбор**

| id | Текст RU / UZ / EN | Верно | Разбор |
|---|---|---|---|
| a | оба всегда от −1 до 1 · ikkalasi ham doim minus birdan birgacha · both always lie between −1 and 1 | ✓ | RU «Да. Координата не бывает длиннее радиуса, а радиус равен единице.» UZ "Ha. Koordinata radiusdan uzun bo'lmaydi, radius esa birga teng." EN "Yes. A coordinate can never exceed the radius, and the radius is one." |
| b | оба всегда положительны · ikkalasi ham doim musbat · both are always positive | | RU «Посмотри на точку слева от центра. Она на окружности, а первое число у неё отрицательное.» UZ "Markazdan chapdagi nuqtaga qarang. U aylanada, lekin birinchi soni manfiy." EN "Look at the point left of the centre. It is on the circle, yet its first number is negative." |
| c | они могут быть любыми · ular istalgan bo'lishi mumkin · they can take any value | | RU «Попробуй поставить точку так, чтобы второе число стало равно двум. Точка уйдёт с окружности.» UZ "Ikkinchi son ikkiga teng bo'ladigan qilib nuqta qo'yib ko'ring. Nuqta aylanadan chiqib ketadi." EN "Try to place the point so the second number becomes two. The point leaves the circle." |
| d | их сумма всегда равна 1 · ularning yig'indisi doim birga teng · their sum is always 1 | | RU «Единице равна сумма квадратов, а не сумма. Возьми точку ноль целых шесть и ноль целых восемь: вместе это больше единицы.» UZ "Birga kvadratlar yig'indisi teng, oddiy yig'indi emas. Nol butun oltidan va nol butun sakkizdan nuqtani oling: ular birgalikda birdan katta." EN "It is the sum of the squares that equals one, not the sum. Take zero point six and zero point eight: together they are more than one." |

**Аудио**

1. RU «Тяни точку по кругу и смотри на счётчик внизу. Он складывает квадраты обоих чисел.»
   UZ "Nuqtani aylana bo'ylab torting va pastdagi hisoblagichga qarang. U ikkala sonning
   kvadratlarini qo'shadi."
   EN "Drag the point around and watch the counter below. It adds the squares of both numbers."
2. RU «Точка едет, числа меняются, а счётчик стоит на единице. Всегда.»
   UZ "Nuqta harakatlanadi, sonlar o'zgaradi, hisoblagich esa birda turibdi. Doim."
   EN "The point moves, the numbers change, and the counter stays at one. Always."
3. RU «Это и есть главное ограничение урока. Что из него следует?»
   UZ "Mana shu darsning asosiy cheklovi. Undan nima kelib chiqadi?"
   EN "That is the key restriction of this lesson. What follows from it?"

---

### Слайд 4 — ОТКРЫТИЕ. Угол 45° (оценивается)

**На экране**

- Точка встала на `π/4`, обе координаты подсвечены и равны
- Вывод по шагам: `x = y` → `x² + x² = 1` → `2x² = 1` → `x = √2/2`
- Вопрос: RU «Почему у 45° координаты равны?» · UZ "Nega qirq besh gradusda koordinatalar
  teng?" · EN "Why are the coordinates equal at 45°?"

**Варианты и разбор**

| id | Текст | Верно | Разбор |
|---|---|---|---|
| a | точка на биссектрисе, обе координаты одинаковы · nuqta bissektrisada, koordinatalar bir xil · the point is on the bisector, so both coordinates match | ✓ | RU «Да. Дальше остаётся посчитать: два икс в квадрате равно одному.» UZ "Ha. Endi hisoblash qoldi: ikki iks kvadrat birga teng." EN "Yes. What is left is arithmetic: two x squared equals one." |
| b | потому что это половина прямого угла · chunki bu to'g'ri burchakning yarmi · because it is half a right angle | | RU «Половина — верно, но равенство даёт биссектриса, а не деление пополам. У тридцати градусов угол тоже часть прямого, а координаты разные.» UZ "Yarmi — to'g'ri, lekin tenglikni bissektrisa beradi, ikkiga bo'lish emas. O'ttiz gradusda ham burchak to'g'ri burchakning qismi, lekin koordinatalar har xil." EN "Half is true, but the equality comes from the bisector, not from halving. Thirty degrees is also part of a right angle, yet its coordinates differ." |
| c | так написано в таблице · jadvalda shunday yozilgan · that is what the table says | | RU «Таблица — это следствие, а не причина. Убираем таблицу с экрана: точка осталась, и значение по-прежнему читается.» UZ "Jadval — natija, sabab emas. Jadvalni ekrandan olamiz: nuqta qoldi va qiymat baribir o'qiladi." EN "The table is a consequence, not a cause. Remove the table: the point is still there and the value still reads off." |
| d | синус всегда равен косинусу · sinus doim kosinusga teng · sine always equals cosine | | RU «Поставь точку на шестьдесят градусов. Числа сразу стали разными.» UZ "Nuqtani oltmish gradusga qo'ying. Sonlar darrov har xil bo'lib qoldi." EN "Set the point at sixty degrees. The numbers become different at once." |

**Аудио**

1. RU «Поставь точку ровно посередине между осями.»
   UZ "Nuqtani o'qlarning aynan o'rtasiga qo'ying."
   EN "Place the point exactly midway between the axes."
2. RU «Оба числа стали одинаковыми. А сумма их квадратов, как и раньше, равна единице.»
   UZ "Ikkala son bir xil bo'ldi. Kvadratlarining yig'indisi esa avvalgidek birga teng."
   EN "Both numbers are now the same. And the sum of their squares is still one."
3. RU «Значит удвоенный квадрат равен единице, и число находится само.»
   UZ "Demak, ikkilangan kvadrat birga teng, va son o'zi topiladi."
   EN "So twice the square equals one, and the number finds itself."

---

### Слайд 5 — ОТКРЫТИЕ. Углы 30° и 60° (оценивается)

**На экране**

- Две точки: `30°` с координатами `(√3/2; 1/2)` и `60°` с координатами `(1/2; √3/2)`
- Отражение относительно биссектрисы движением: точки меняются местами
- Вопрос: RU «Чему равен cos 60°?» · UZ "Kosinus oltmish nimaga teng?" · EN "What is cos 60°?"

**Варианты и разбор**

| id | Текст | Верно | Разбор |
|---|---|---|---|
| a | 1/2 | ✓ | RU «Да. У шестидесяти градусов точка высоко и близко к оси, поэтому первое число маленькое.» UZ "Ha. Oltmish gradusda nuqta baland va o'qqa yaqin, shuning uchun birinchi son kichik." EN "Yes. At sixty degrees the point is high and close to the axis, so the first number is small." |
| b | √3/2 | | RU «Это косинус тридцати. Посмотри: обе точки на экране, у тридцати градусов точка правее.» UZ "Bu o'ttizning kosinusi. Qarang: ikkala nuqta ekranda, o'ttiz gradusda nuqta o'ngroqda." EN "That is the cosine of thirty. Look: both points are shown, and the thirty-degree one sits further right." |
| c | √2/2 | | RU «Это сорок пять градусов. Их точка стоит между двумя отмеченными.» UZ "Bu qirq besh gradus. Uning nuqtasi belgilangan ikki nuqta orasida turadi." EN "That is forty-five degrees. Its point lies between the two marked ones." |
| d | 1 | | RU «Единица бывает только у точки на горизонтальной оси, а это угол ноль.» UZ "Bir faqat gorizontal o'qdagi nuqtada bo'ladi, bu esa nol burchak." EN "One belongs only to the point on the horizontal axis, and that is the zero angle." |

**Аудио**

1. RU «Отметь тридцать градусов, потом шестьдесят. Посмотри на пары чисел.»
   UZ "O'ttiz gradusni, keyin oltmishni belgilang. Sonlar juftligiga qarang."
   EN "Mark thirty degrees, then sixty. Look at the pairs of numbers."
2. RU «Числа одни и те же, только поменялись местами. Отражение через середину переводит одну
   точку в другую.»
   UZ "Sonlar aynan o'sha, faqat o'rin almashdi. O'rtadan o'tgan aks ettirish bir nuqtani
   ikkinchisiga o'tkazadi."
   EN "The numbers are the same, only swapped. A reflection through the middle carries one point
   onto the other."
3. RU «Поэтому эти два угла и путают чаще всего. Смотри не в память, а на высоту точки.»
   UZ "Shuning uchun aynan shu ikki burchak ko'p chalkashtiriladi. Xotiraga emas, nuqtaning
   balandligiga qarang."
   EN "That is exactly why these two angles get mixed up. Do not look at memory — look at how
   high the point sits."

---

### Слайд 6 — ЛОМАЕТСЯ. Осевые углы (оценивается)

**На экране**

- Точка встала в `π/2`, координаты `(0; 1)`
- Вопрос: RU «Чему равен cos 90°?» · UZ "Kosinus to'qson nimaga teng?" · EN "What is cos 90°?"
- После верного ответа добираются точки `0`, `π`, `3π/2` — четыре точки остаются до конца урока

**Варианты и разбор**

| id | Текст | Верно | Разбор |
|---|---|---|---|
| a | 0 | ✓ | RU «Да. Точка стоит на вертикальной оси, вправо она не ушла совсем.» UZ "Ha. Nuqta vertikal o'qda turibdi, o'ngga umuman siljimagan." EN "Yes. The point sits on the vertical axis; it has not moved right at all." |
| b | 1 | | RU «Единица — у точки справа, а это угол ноль. Подсвечиваю обе точки: они в разных местах.» UZ "Bir — o'ngdagi nuqtada, bu esa nol burchak. Ikkala nuqtani yoritaman: ular har xil joyda." EN "One belongs to the point on the right, which is the zero angle. Both points are highlighted: they are in different places." |
| c | −1 | | RU «Это точка слева, угол сто восемьдесят градусов.» UZ "Bu chapdagi nuqta, yuz sakson gradus burchak." EN "That is the point on the left, the angle of one hundred eighty degrees." |
| d | не существует · mavjud emas · undefined | | RU «Точка есть, и первое число у неё есть. Оно равно нулю, а не отсутствует.» UZ "Nuqta bor va uning birinchi soni ham bor. U nolga teng, yo'q emas." EN "The point exists and so does its first number. It equals zero — it is not missing." |

**Аудио**

1. RU «Подними точку на самый верх, на четверть оборота.»
   UZ "Nuqtani eng tepaga, chorak aylanishga ko'taring."
   EN "Lift the point to the very top, a quarter turn."
2. RU «Вверх она ушла на всю единицу, а вправо не сдвинулась совсем.»
   UZ "Yuqoriga u to'liq bir birlikka ko'tarildi, o'ngga esa umuman siljimadi."
   EN "It has risen a full unit upward, but has not shifted right at all."
3. RU «Отсюда и ответ. Смотри на положение точки, а не на привычную единицу.»
   UZ "Javob shundan. Odatdagi birga emas, nuqtaning holatiga qarang."
   EN "That is where the answer comes from. Look at the position, not at the familiar one."

---

### Слайд 7 — КОРОТКИЙ ВОПРОС перед правилом (оценивается)

**На экране**

- Вопрос: RU «Одна запись невозможна. Какая?» · UZ "Bitta yozuv bo'lishi mumkin emas.
  Qaysi biri?" · EN "One statement is impossible. Which one?"
- Четыре записи: `sin α = 1,2` · `cos α = −0,8` · `sin α = 0` · `cos α = √2/2`

**Варианты и разбор**

| id | Текст | Верно | Разбор |
|---|---|---|---|
| a | `sin α = 1,2` | ✓ | RU «Да. Такая точка была бы выше окружности, а на окружности её нет.» UZ "Ha. Bunday nuqta aylanadan yuqorida bo'lardi, aylanada esa u yo'q." EN "Yes. Such a point would be above the circle, and there is no such point on it." |
| b | `cos α = −0,8` | | RU «Минус здесь разрешён: слева от центра первое число отрицательное, а точка на окружности.» UZ "Bu yerda minus ruxsat etiladi: markazdan chapda birinchi son manfiy, nuqta esa aylanada." EN "A minus is allowed here: to the left of the centre the first number is negative and the point is still on the circle." |
| c | `sin α = 0` | | RU «Ноль разрешён. Это точка на горизонтальной оси, вверх она не поднялась.» UZ "Nol ruxsat etiladi. Bu gorizontal o'qdagi nuqta, u yuqoriga ko'tarilmagan." EN "Zero is allowed. That is a point on the horizontal axis; it has not risen." |
| d | `cos α = √2/2` | | RU «Это сорок пять градусов, точка на биссектрисе. Мы её уже ставили.» UZ "Bu qirq besh gradus, bissektrisadagi nuqta. Biz uni allaqachon qo'ygan edik." EN "That is forty-five degrees, the point on the bisector. We placed it earlier." |

**Аудио**

1. RU «Четыре записи. Три из них встречаются на окружности, а одна не встречается никогда.»
   UZ "To'rtta yozuv. Uchtasi aylanada uchraydi, bittasi esa hech qachon uchramaydi."
   EN "Four statements. Three of them occur on the circle; one never does."
2. RU «Проверь каждую точкой: попробуй её поставить.»
   UZ "Har birini nuqta bilan tekshiring: uni qo'yib ko'ring."
   EN "Check each one with the point: try to place it."

---

---

## Что проверить перед сборкой

- в UZ-строках нет кириллицы, апостроф везде ASCII `'`;
- в озвучке нет `π`, `√`, `²`, `=`, `−` — всё словами;
- чтение дробей с π вслух подтверждено узбекским методистом;
- образец из учебника на слайде 8 вставлен и сверен по странице;
- числа и верные ответы одинаковы во всех трёх языках.
