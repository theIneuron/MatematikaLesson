# Урок 1. Числовые выражения — контент. НА УТВЕРЖДЕНИЕ

Статус: **этап 2 пройден, сборка не начата.** Скелет: `DARS01_SKELET.md`.

Три языка равнозначны: одинаковые числа, одинаковые верные ответы, одинаковые разборы.
Порядок в коде — `L(uz, ru, en)`, узбекский первым.

**Правила, по которым это написано.** Узбекский — латиница, обращение `siz`, апостроф
только ASCII `'`, порядок слов SOV. Русский — «ты», прошедшее время без привязки к полу.
Английский — draft. В озвучке нет знаков `= : · − % ≠` и кавычек: все числа и все действия
названы словами. Аудио шире экранного текста. Каждый экран со 2-го начинается с фразы-моста,
и на экран она не выводится. Маркер языка в озвучке ставит движок, в контенте его нет.

Как читаются действия в озвучке: RU — «плюс, минус, умножить на, разделить на»;
UZ — `qo'shish, ayirish, ko'paytirish, bo'lish` (термины со стр. 12 узбекского издания);
EN — `plus, minus, times, divided by`.

---

## Служебное

**Заголовок урока**

| | |
|---|---|
| UZ | `Sonli ifodalar` |
| RU | Числовые выражения |
| EN | Numerical expressions |

Номер: `1-dars` / Урок 1 / Lesson 1. Блок: `B1-blok` / Блок Б1 / Block B1, уроки 1–6,
текущий 1. Идентификатор: `alg_7_01`. Голос мужской, `g=m`.

**Теги заблуждений.** На итоге пробел называется этими словами, не процентом.

| Код | UZ | RU | EN |
|---|---|---|---|
| Z1 | `chapdan o'ngga ketma-ket sanash` | счёт подряд слева направо | counting straight from left to right |
| Z2 | `ikkinchi bosqich ichidagi tartib` | порядок внутри второй ступени | the order inside the second stage |
| Z3 | `birinchi bosqich ichidagi tartib` | порядок внутри первой ступени | the order inside the first stage |
| Z4 | `qavslar qiymatni o'zgartirmaydi` | скобки не меняют значение | brackets do not change the value |
| Z5 | `bitta yozuvda ikki qiymat` | у одной записи два значения | one expression with two values |
| Z6 | `ifoda va uning qiymati` | выражение и его значение | an expression and its value |

**Список действий прибора** (один и тот же на весь урок)

| id | UZ | RU | EN |
|---|---|---|---|
| `bracket` | `Qavs ichidagini hisoblash` | Посчитать в скобках | Do what is inside the brackets |
| `stage2` | `Ikkinchi bosqich amali` | Действие второй ступени | A second-stage operation |
| `stage1` | `Birinchi bosqich amali` | Действие первой ступени | A first-stage operation |

---

# Экран 1. ХУК. Две машины, одна запись

Поле `graph`. Кнопки «Назад» нет. Оценки нет, это прогноз.

**Бровка** — `Taxmin` / Прогноз / Prediction
**Заголовок** — `Ikki mashina, bitta yozuv` / Две машины, одна запись / Two machines, one expression

**На экране**

```
                    18 − 6 : 3 + 4

     ┌──────────────────┐        ┌──────────────────┐
     │ oddiy kalkulyator│        │ muhandislik      │
     │ обычный          │  (≠)   │ инженерный       │
     │ a basic one      │        │ a scientific one │
     │        8         │        │        20        │
     └──────────────────┘        └──────────────────┘
```

**Вопрос** — `Nega sonlar farq qildi?` / Почему числа разошлись? / Why did the numbers differ?

**Озвучка, четыре куска**

1. UZ `Bugungi dars mavzusi sonli ifodalar. Bitta yozuvni ikkita kalkulyatorga berdik.`
   RU Сегодня тема урока — числовые выражения. Одну и ту же запись мы отдали двум калькуляторам.
   EN Today's topic is numerical expressions. We gave one and the same expression to two calculators.
2. UZ `Chapda oddiy kalkulyator, o'ngda muhandislik kalkulyatori. Yozuv bitta, o'n sakkiz ayirish olti bo'lish uch qo'shish to'rt.`
   RU Слева обычный калькулятор, справа инженерный. Запись одна: восемнадцать минус шесть разделить на три плюс четыре.
   EN On the left a basic calculator, on the right a scientific one. One expression: eighteen minus six divided by three plus four.
3. UZ `Oddiysi sakkizni ko'rsatdi. Muhandisligi yigirmani ko'rsatdi. Sonlar har xil, yozuv esa bitta.`
   RU Обычный показал восемь. Инженерный показал двадцать. Числа разные, а запись одна.
   EN The basic one showed eight. The scientific one showed twenty. Different numbers, one expression.
4. UZ `Sizningcha nima bo'ldi. Javobingizni tanlang, bu taxmin, uning uchun baho yo'q. Dars oxirida unga qaytamiz.`
   RU Как думаешь, что здесь происходит. Выбери свой ответ. Это прогноз, оценки за него нет, и в конце урока мы к нему вернёмся.
   EN What do you think is going on. Pick your answer. This is a prediction, it is not graded, and we will come back to it at the end.

**Варианты и разборы**

| Вариант (UZ / RU / EN) | Тег | Разбор, произносится |
|---|---|---|
| `Mashinalar yozuvni har xil tartibda o'qiydi` / Машины читают запись в разном порядке / The machines read the expression in a different order | — | UZ `Bu bizning savolimiz. Hozir yozuvning o'zida qaysi tartib sakkiz, qaysi tartib yigirma berishini tekshiramiz.` · RU Это и есть наш вопрос. Сейчас проверим на самой записи, какой порядок даёт восемь, а какой двадцать. · EN That is our question. Now we will check on the expression itself which order gives eight and which gives twenty. |
| `Mashinalardan biri buzuq` / Одна из машин сломана / One of the machines is broken | — | UZ `Ikkala mashina ham soz. Har biri o'z qoidasi bo'yicha hisoblaydi, va shu qoidalardan biri matematikada qabul qilingan. Qaysi biri ekanini topamiz.` · RU Обе машины исправны. Каждая считает по своему правилу, и одно из этих правил принято в математике. Найдём какое. · EN Both machines work. Each follows its own rule, and one of those rules is the one mathematics uses. Let us find which. |
| `Bu yozuvning ikkita to'g'ri qiymati bor` / У этой записи два верных значения / This expression has two correct values | Z5 | UZ `Bo'lish belgisiga qarang. Nimani oldin hisoblashni aynan u hal qiladi. Oldin esa faqat bitta narsani hisoblash mumkin.` · RU Посмотри на знак деления. Именно он решает, что считать раньше. А раньше можно посчитать только что-то одно. · EN Look at the division sign. It decides what is done first. And only one thing can be done first. |
| `Yozuvda qavs yetishmaydi` / В записи не хватает скобок / The expression is missing brackets | Z4 | UZ `Qavs qo'yish mumkin, va biz buni qilamiz. Lekin unda boshqa yozuv hosil bo'ladi, o'qish kerak bo'lgani esa mana bu.` · RU Скобки поставить можно, и мы это сделаем. Но тогда получится другая запись, а прочитать надо эту. · EN You can add brackets, and we will. But that makes a different expression, and this one is what we have to read. |

---

# Экран 2. ОПОРА. Что уже умеешь из 6 класса

Прибор `ProbeChain`, три коротких. Отвеченный схлопывается в строку. Балла нет, тег есть.

**Бровка** — `Tayanch` / Опора / Warm-up
**Заголовок** — `6-sinfdan nimani bilasiz` / Что уже умеешь из 6 класса / What you already know from grade 6

**Мост** (первый кусок озвучки, на экран не выводится)

UZ `Qoidani izlashdan oldin oltinchi sinfdan uchta narsani eslaymiz. Bu yerda baho yo'q.`
RU Прежде чем искать правило, вспомним три вещи из шестого класса. Оценки здесь нет.
EN Before we look for the rule, let us recall three things from grade six. Nothing is graded here.

### Вопрос 1. `7 · 4 − 5`, верно 23

| Вариант | Тег | Разбор |
|---|---|---|
| **23** | — | верный, разбора нет |
| −7 | — | UZ `Bu yerda ayirish birinchi hisoblangan, go'yo uning atrofida qavs turgandek. Yozuvda esa qavs yo'q.` · RU Здесь вычитание посчитано первым, как будто вокруг него стоят скобки. Скобок в записи нет. · EN Here the subtraction went first, as if brackets stood around it. There are no brackets. |
| 28 | — | UZ `Bu faqat ko'paytirish. Beshlik yozuvda qoldi, lekin hisobga kirmadi.` · RU Это только умножение. Пятёрка в записи осталась, но в счёт не вошла. · EN That is the multiplication only. The five is still there but was never used. |
| 6 | — | UZ `Bu yerda yetti va to'rt qo'shilgan. Ular orasida esa ko'paytirish belgisi turibdi.` · RU Здесь семь и четыре сложены. А между ними стоит знак умножения. · EN Here seven and four were added. But the sign between them is multiplication. |

### Вопрос 2. `20 : 4 + 1`, верно 6

| Вариант | Тег | Разбор |
|---|---|---|
| **6** | — | верный |
| 4 | Z1 | UZ `Oltinchi sinfda ko'paytirish va bo'lish qo'shishdan oldin hisoblanardi. Bu yozuvda nima birinchi bo'lishi kerakligini yana bir bor tekshiring.` · RU В шестом классе умножение и деление считались раньше сложения. Проверь ещё раз, что в этой записи должно быть первым. · EN In grade six, multiplication and division came before addition. Check once more what has to be first here. |
| 21 | — | UZ `Bu yerda yigirma va bir qo'shilgan, bo'lish esa bajarilmagan. Yozuvda bo'lish belgisi turibdi.` · RU Здесь двадцать и один сложены, а деление не сделано. В записи знак деления стоит. · EN Here twenty and one were added and the division was skipped. The division sign is right there. |
| 5 | — | UZ `Bu faqat bo'lish. Birlik yozuvda bor, lekin hisobga kirmadi.` · RU Это только деление. Единица в записи есть, но в счёт не вошла. · EN That is the division only. The one is in the expression but was never used. |

### Вопрос 3. `2 · (3 + 4)`, верно 14

| Вариант | Тег | Разбор |
|---|---|---|
| **14** | — | верный |
| 10 | Z4 | UZ `Bu yerda ikki uchga ko'paytirilgan, to'rtlik esa alohida qo'shilgan. Qavs aynan nimani qamrab olganiga qarang.` · RU Здесь два умножено на три, а четвёрка прибавлена отдельно. Посмотри, что именно охватывает скобка. · EN Here two was multiplied by three and the four was added separately. Look at what the bracket actually holds. |
| 9 | — | UZ `Bu yerda hammasi qo'shilgan. Qavs oldida esa ko'paytirish belgisi turibdi.` · RU Здесь всё сложено. А перед скобкой стоит знак умножения. · EN Here everything was added. But the sign before the bracket is multiplication. |
| 24 | — | UZ `Bu yerda to'rtga yana bir marta ko'paytirilgan. Qavs ichida uch va to'rt qo'shiladi, ko'paytirilmaydi.` · RU Здесь на четвёрку умножено ещё раз. В скобке три и четыре складываются, а не умножаются. · EN Here it was multiplied by four as well. Inside the bracket three and four are added, not multiplied. |

---

# Экран 3. ОБЪЯСНЕНИЕ 1. Расставь порядок сам

Прибор `StepOrder`. Тег Z1.

**Бровка** — `Ochamiz` / Разбираемся / Working it out
**Заголовок** — `Tartibni o'zingiz qo'ying` / Расставь порядок сам / Set the order yourself

**На экране**

```
            18 − 6 : 3 + 4
               ①   ②   ③
            ─────────────────
   sizning tartibingiz bo'yicha / по твоему порядку / by your order:   8
   qoida bo'yicha / по правилу / by the rule:                         20
```

Вторая строка появляется только **после** того, как ученик поставил все три номера.

**Озвучка**

1. мост. UZ `Bahs bahs bilan emas, hisob bilan hal bo'ladi.` · RU Спор решается не спором, а счётом. · EN An argument is settled by counting, not by arguing.
2. UZ `O'sha yozuvni oling. Amal belgilarini bosing va qaysi biri birinchi, qaysi biri ikkinchi bo'lishini o'zingiz belgilang.` · RU Возьми ту же запись. Нажимай на знаки действий и сам поставь, какое из них первое, какое второе. · EN Take the same expression. Tap the operation signs and set for yourself which one is first and which is second.
3. по шагу `done`. UZ `Qarang. Sizning tartibingiz bo'yicha bitta son chiqdi, qoida bo'yicha boshqasi. Yozuv bitta, son esa ikkita.` · RU Смотри. По твоему порядку получилось одно число, по правилу другое. Запись одна, а чисел два. · EN Look. Your order gave one number, the rule gave another. One expression, two numbers.
4. по шагу `done`. UZ `Demak tartib haqiqatan ham hal qiladi. Endi sakkiz qayerdan kelganini topamiz.` · RU Значит порядок действительно решает. Теперь найдём, откуда взялось восемь. · EN So the order really does decide. Now let us find where the eight came from.

**Если ученик поставил порядок, дающий 20 с первой попытки**

UZ `Siz qoida bilan bir xil tartibni qo'ydingiz. Unda oddiy kalkulyator qaysi tartibni oldi ekan. Qo'yib ko'ring.`
RU Ты поставил тот же порядок, что и правило. Тогда какой порядок взял обычный калькулятор? Попробуй поставить и его.
EN You set the same order as the rule. Then what order did the basic calculator take? Try setting that one too.

---

# Экран 4. ОБЪЯСНЕНИЕ 2. Поставь скобку

Прибор `BracketGap`. Тег Z4.

**Бровка** — `Farqni ko'ramiz` / Разграничение / Telling them apart
**Заголовок** — `Sakkiz qayerdan keldi` / Откуда взялось восемь / Where the eight came from

**На экране**

```
        ( 18 − 6 ) : 3 + 4   =   8
          18 − 6   : 3 + 4   =  20
```

Вторая строка стоит с первой секунды, первая собирается учеником.

**Озвучка**

1. мост. UZ `Oddiy kalkulyator sakkizni berdi. Bu son qayerdan kelganini ko'ramiz.` · RU Обычный калькулятор дал восемь. Посмотрим, откуда это число берётся. · EN The basic calculator gave eight. Let us see where that number comes from.
2. UZ `Yozuvga qavs qo'ying. Shunday qo'yingki, qiymat aynan sakkiz bo'lsin.` · RU Поставь в запись скобку. Так, чтобы значение стало ровно восемь. · EN Place a bracket in the expression. Place it so the value comes out as exactly eight.
3. по шагу `ok`. UZ `Mana javob. Sakkiz bu qavsli yozuvning qiymati. Oddiy kalkulyator xato qilmagan, u boshqa yozuvni o'qigan.` · RU Вот и ответ. Восемь — это значение записи со скобкой. Обычный калькулятор не ошибся, он прочитал другую запись. · EN There it is. Eight is the value of the expression with the bracket. The basic calculator did not make a mistake, it read a different expression.
4. по шагу `ok`. UZ `Darslikning o'n ikkinchi betida shunday ikkita yozuv yonma-yon turibdi, ular orasida teng emas belgisi bor.` · RU В учебнике на странице двенадцать две такие записи стоят рядом, и между ними стоит знак не равно. · EN In the textbook on page twelve two such expressions stand side by side with a not-equal sign between them.

**Неверные постановки скобки и разборы**

| Ученик поставил | Значение | Разбор |
|---|---|---|
| `18 − (6 : 3) + 4` | 20 | UZ `Qavs hech narsani o'zgartirmadi. Bo'lish baribir birinchi bajarilardi. Qavs ichiga boshqa narsani oling.` · RU Скобка ничего не изменила: деление и так считалось первым. Возьми в скобку что-нибудь другое. · EN The bracket changed nothing: the division was going first anyway. Put something else inside it. |
| `18 − 6 : (3 + 4)` | около 17,1 | UZ `Endi uch va to'rt qo'shildi, va bo'linadigan son o'zgardi. Sakkiz olish uchun qavs boshqa joyda turishi kerak.` · RU Теперь три и четыре сложились, и делить пришлось на другое число. Чтобы получить восемь, скобка должна стоять в другом месте. · EN Now three and four were added and the divisor changed. To get eight the bracket has to sit elsewhere. |
| `(18 − 6 : 3) + 4` | 20 | UZ `Qavs ichida ham o'sha tartib ishlaydi, shuning uchun son o'zgarmadi. Bo'lishni qavsdan chiqarib ko'ring.` · RU Внутри скобки работает тот же порядок, поэтому число не изменилось. Попробуй оставить деление за скобкой. · EN The same order works inside the bracket, so the number did not change. Try leaving the division outside. |

---

# Экран 5. ОБЪЯСНЕНИЕ 3. Ступени действий

Прибор `Transform`. Тег Z1. Здесь термины вводятся дословно по учебнику.

**Бровка** — `Darslik tili bilan` / Словами учебника / In the textbook's words
**Заголовок** — `Amallar bosqichlari` / Ступени действий / Stages of operations

**На экране** (строки появляются по шагу ученика)

```
        18 − 6 : 3 + 4
        18 −  2  + 4
           16 + 4
             20
```

**Озвучка**

1. мост. UZ `Endi narsalarni darslik ataganidek ataymiz.` · RU Теперь назовём вещи так, как их называет учебник. · EN Now let us name things the way the textbook names them.
2. UZ `Qo'shish va ayirish birinchi bosqich amallari. Ko'paytirish va bo'lish ikkinchi bosqich amallari. Darajaga ko'tarish uchinchi bosqich, u bilan keyinroq uchrashamiz.` · RU Сложение и вычитание — действия первой ступени. Умножение и деление — действия второй ступени. Возведение в степень — третья ступень, с ней мы встретимся позже. · EN Addition and subtraction are first-stage operations. Multiplication and division are second-stage. Raising to a power is the third stage, and we will meet it later.
3. UZ `Yozuvni qadamba-qadam ko'chirib yozing. Qismini tanlang, amalni tanlang, va yangi qator pastda paydo bo'ladi.` · RU Перепиши запись по шагам. Выбери часть, выбери действие — и новая строка появится ниже. · EN Rewrite the expression step by step. Pick a part, pick an operation, and a new line appears below.
4. по шагу `s1`. UZ `Ikkinchi bosqich birinchi ketdi. Olti bo'lish uch ikkiga aylandi, qolgani esa joyida turibdi.` · RU Вторая ступень пошла первой. Шесть разделить на три стало двойкой, остальное осталось на месте. · EN The second stage went first. Six divided by three became two, and the rest stayed put.
5. по шагу `s3`. UZ `Qolgan ikkita amal bitta bosqichda. Ular yozilish tartibida, chapdan o'ngga bajariladi.` · RU Оставшиеся два действия — на одной ступени. Они выполняются в порядке записи, слева направо. · EN The two remaining operations are on the same stage. They are done in the order they are written, left to right.

---

# Экран 6. ОБЪЯСНЕНИЕ 4. Обе на второй ступени

Четыре варианта — **экран квоты**. Тег Z2.

**Бровка** — `O'zingiz` / Сам / On your own
**Заголовок** — `Ikkalasi ham ikkinchi bosqichda` / Обе на второй ступени / Both on the second stage

**На экране** — запись `24 : 6 · 2`, вопрос `Qiymati nechaga teng?` / Чему равно значение? / What is the value?

**Мост** UZ `Yangi holat. Bu yerda ikkala amal ham bitta bosqichda turibdi.` · RU Новый случай. Здесь оба действия стоят на одной ступени. · EN A new case. Here both operations are on the same stage.

| Вариант | Тег | Разбор |
|---|---|---|
| **8** | — | верный. UZ `Ha. Ikkalasi bitta bosqichda, shuning uchun chapdan o'ngga.` · RU Да. Обе на одной ступени, поэтому слева направо. · EN Yes. Both on the same stage, so left to right. |
| 2 | Z2 | UZ `Siz ko'paytirishni bo'lishdan oldin hisobladingiz. Ikkalasi ham ikkinchi bosqichda, ular orasida kattaligi bo'yicha farq yo'q. Yozuvda qaysi belgi chaproqda turganiga qarang.` · RU Ты посчитал умножение раньше деления. Обе на второй ступени, и старшинства между ними нет. Посмотри, какой из двух знаков стоит в записи левее. · EN You did the multiplication before the division. Both are second-stage and neither outranks the other. Look at which of the two signs stands further left. |
| 12 | — | UZ `Bu yozuvning faqat bir qismi. Yigirma to'rtga bo'lish bajarilmay qoldi.` · RU Это значение только части записи. Деление двадцати четырёх осталось несделанным. · EN That is the value of only a part. The division of twenty-four was never done. |
| 48 | — | UZ `Bu yerda yigirma to'rt ikkiga ko'paytirilgan. Oltilikdan oldin esa bo'lish belgisi turibdi.` · RU Здесь двадцать четыре умножено на два. А перед шестёркой стоит знак деления. · EN Here twenty-four was multiplied by two. But the sign before the six is division. |

После ответа рядом встают два числа: `8` по правилу и `2` при обратном порядке.

---

# Экран 7. ОБЪЯСНЕНИЕ 5. Одна ступень

Прибор `StepOrder`. Тег Z3. Граничный случай.

**Бровка** — `Chegaraviy holat` / Граничный случай / The edge case
**Заголовок** — `Bitta bosqich` / Одна ступень / One stage

**На экране**

```
              20 − 5 + 3

   «avval qo'shish» / «сначала сложение» / “addition first”:   12
   qoida bo'yicha / по правилу / by the rule:                  18
```

**Озвучка**

1. мост. UZ `Yana bitta holat qoldi, va u eng aldamchisi.` · RU Остался ещё один случай, и он самый обманчивый. · EN One case is left, and it is the most deceptive one.
2. UZ `Bu yerda ayirish ham, qo'shish ham birinchi bosqichda. Tartibni qo'ying va ikkala sonni ko'ring.` · RU Здесь и вычитание, и сложение на первой ступени. Расставь порядок и посмотри на оба числа. · EN Here both the subtraction and the addition are first-stage. Set the order and look at both numbers.
3. по шагу `done`. UZ `O'n ikki va o'n sakkiz. Bitta bosqich ichida kattalik yo'q. Faqat yozilish tartibi bor, chapdan o'ngga.` · RU Двенадцать и восемнадцать. Внутри одной ступени старшинства нет вообще. Есть только порядок записи, слева направо. · EN Twelve and eighteen. Inside one stage nothing outranks anything. There is only the written order, left to right.
4. по шагу `done`. UZ `Darslikning birinchi qoidasi aynan shu haqda.` · RU Первое правило учебника ровно об этом. · EN The textbook's first rule says exactly this.

---

# Экран 8. ПРАВИЛО. Собери формулировку

Прибор `RuleBuilder`. Поле `accent`. Тег Z1. Карточка открывается только после сборки.

**Бровка** — `Qoida` / Правило / The rule
**Заголовок** — `Qoidani o'zingiz yig'ing` / Собери правило сам / Build the rule yourself

**Фрагменты для сборки** (лежат вперемешку, верный порядок — как в списке)

| № | UZ | RU | EN |
|---:|---|---|---|
| 1 | `avval qavs ichidagi amallar` | сначала действия в скобках | first what is inside the brackets |
| 2 | `so'ng uchinchi bosqich amallari` | затем действия третьей ступени | then the third-stage operations |
| 3 | `so'ng ikkinchi bosqich amallari` | затем действия второй ступени | then the second-stage operations |
| 4 | `so'ng birinchi bosqich amallari` | затем действия первой ступени | then the first-stage operations |
| 5 | `bitta bosqich ichida chapdan o'ngga` | внутри одной ступени — слева направо | inside one stage, left to right |

**Карточка правила после сборки** — дословно из учебника, § 1, стр. 12.

Первая строка — определения:

- UZ `Sonli ifoda deb sonlar va bir yoki bir necha amallar yordamida birlashtirilgan matematik yozuvga aytiladi.`
- RU «Числовое выражение — это математическая запись, которая состоит из чисел и одной или нескольких арифметических операций.»
- EN A numerical expression is a mathematical record made of numbers and one or more arithmetic operations. *(draft)*

- UZ `Sonli ifodaning qiymati deb shu sonli ifodada ko'rsatilgan amallarni bajarish natijasida hosil bo'lgan songa aytiladi.`
- RU «Значением числового выражения является число, полученное в результате действий, указанных в этом числовом выражении.»
- EN The value of a numerical expression is the number obtained by carrying out the operations shown in it. *(draft)*

Дальше четыре правила порядка дословно (RU-колонка приведена в скелете, § 2). Внизу
карточки — `1-§, 12-bet` / § 1, стр. 12 / § 1, p. 12.

**Возврат хука.** Под карточкой снова встают две карточки с экрана 1. Карточка `8` гаснет,
карточка `20` зеленеет.

Подпись: `Bitta yozuv — bitta qiymat` / Одна запись — одно значение / One expression, one value.

**Озвучка**

1. мост. UZ `Hamma narsani ko'rdik. Endi qoidani so'z bilan yig'amiz.` · RU Всё, что нужно, мы увидели. Теперь соберём правило словами. · EN We have seen everything we need. Now let us put the rule into words.
2. UZ `Bo'laklarni to'g'ri tartibda joylashtiring.` · RU Разложи фрагменты в верном порядке. · EN Put the pieces in the right order.
3. по шагу `ok`. UZ `To'g'ri. Endi darslik buni qanday aytishini o'qing, biz so'zlarni o'zgartirmadik.` · RU Верно. Теперь прочитай, как это говорит учебник — слов мы не меняли. · EN Correct. Now read how the textbook says it. We did not change the wording.
4. по шагу `ok`. UZ `Va birinchi ekranga qayting. Sakkiz o'chdi, yigirma qoldi. Bitta yozuvning qiymati bitta bo'ladi.` · RU И вернёмся к первому экрану. Восемь погасло, двадцать осталось. У одной записи значение одно. · EN And back to the first screen. The eight is gone, the twenty stays. One expression has one value.

**Неверная сборка**

UZ `Tartib buzildi. Qavs qayerda turishi kerakligini o'ylab ko'ring, u boshqa hamma narsadan oldin ishlaydi.`
RU Порядок нарушен. Подумай, где должны стоять скобки — они срабатывают раньше всего остального.
EN The order is off. Think about where the brackets belong. They act before everything else.

---

# Экран 9. ПРАКТИКА 1. Три подряд

Прибор `SlotFill`, три записи. Ответ **собирается**, не выбирается. Теги Z1, Z2.

**Бровка** — `Mashq` / Практика / Practice
**Заголовок** — `Uchtasi ketma-ket` / Три подряд / Three in a row

**Мост** UZ `Qoida tayyor. Endi uni uchta yozuvda sinab ko'ramiz.` · RU Правило готово. Проверим его на трёх записях. · EN The rule is ready. Let us try it on three expressions.

| Запись | Верно | При неверном порядке | Разбор |
|---|---:|---|---|
| `30 − 12 : 4` | 27 | подряд слева направо: 4,5 | UZ `Chapdan o'ngga sanasangiz, butun son ham chiqmaydi. Qaysi amal ikkinchi bosqichda ekaniga qarang.` · RU Если считать подряд слева направо, не получится даже целого числа. Посмотри, какое из действий на второй ступени. · EN Counting straight left to right does not even give a whole number. Look at which operation is second-stage. |
| `5 + 3 · 6` | 23 | подряд слева направо: 48 | UZ `Qirq sakkiz bu sakkizni oltiga ko'paytirgani. Beshlik esa ko'paytirishga kirmasligi kerak.` · RU Сорок восемь — это восемь умножить на шесть. А пятёрка в умножение входить не должна. · EN Forty-eight is eight times six. But the five should not be part of the multiplication. |
| `40 : 8 : 5` | 1 | справа налево: 25 | UZ `Ikkala amal ham bo'lish, ikkalasi bitta bosqichda. Shuning uchun o'ngdan emas, chapdan boshlanadi.` · RU Оба действия — деление, обе на одной ступени. Поэтому счёт начинается слева, а не справа. · EN Both operations are division and both are on the same stage. So it starts from the left, not the right. |

Третья запись главная: она показывает, что «слева направо» — это правило, а не привычка.

---

# Экран 10. ПРАКТИКА 2. Со скобкой, по шагам

Прибор `Transform`. Тег Z4.

**Бровка** — `Yo'naltirilgan mashq` / Направляемая практика / Guided practice
**Заголовок** — `Qavs bilan` / Со скобкой / With a bracket

```
        3 · (12 − 4 : 2)
        3 · (12 −  2 )
           3 ·  10
             30
```

**Озвучка**

1. мост. UZ `Endi qavsli yozuv. Bu yerda ikkita qoida birga ishlaydi.` · RU Теперь запись со скобкой. Здесь два правила работают вместе. · EN Now an expression with a bracket. Here two rules work together.
2. UZ `Har qadamda qismini tanlang va amalni ayting.` · RU На каждом шаге выбирай часть и называй действие. · EN At each step pick a part and name the operation.
3. по шагу `s1`. UZ `Qavs ichida ham o'sha tartib. Avval bo'lish, keyin ayirish.` · RU Внутри скобки — тот же порядок. Сначала деление, потом вычитание. · EN Inside the bracket the same order holds. Division first, then subtraction.
4. по шагу `s3`. UZ `Qavs ishini tugatdi va yo'qoldi. Qolgani oddiy ko'paytirish.` · RU Скобка сделала своё дело и исчезла. Дальше обычное умножение. · EN The bracket has done its job and is gone. What is left is a plain multiplication.

---

# Экран 11. ПРАКТИКА 3. Сам, без прибора

Прибора на экране нет. Только форма ответа. Тег Z1.

**Бровка** — `Faqat o'zingiz` / Только сам / On your own only
**Заголовок** — `Asbobsiz` / Без прибора / Without the tool

Запись `50 − 6 · 4 + 2`, значение 28.

**Озвучка**

1. мост. UZ `Endi yordamchi asbobsiz. Qadamlar ekranda ko'rinmaydi, ularni o'zingiz o'ylaysiz.` · RU Теперь без вспомогательного прибора. Шаги на экране не появятся, их ты держишь в голове. · EN Now with no helper tool. The steps will not appear on screen. You hold them in your head.
2. UZ `Qiymatni yig'ing va tekshirishni bosing.` · RU Собери значение и нажми проверить. · EN Build the value and tap check.

**Разборы**

| Ответ | Тег | Разбор |
|---|---|---|
| 178 | Z1 | UZ `Bu chapdan o'ngga sanagani. Ellikdan oltini ayirib, keyin to'rtga ko'paytirgansiz. Ko'paytirish qaysi sonlarga tegishli ekaniga qarang.` · RU Это счёт подряд слева направо: из пятидесяти вычли шесть и умножили на четыре. Посмотри, к каким числам относится умножение. · EN That is counting straight left to right: fifty minus six, then times four. Look at which numbers the multiplication belongs to. |
| 26 | — | UZ `Ko'paytirish to'g'ri bajarilgan, lekin oxirgi qo'shish bajarilmagan.` · RU Умножение сделано верно, но последнее сложение не выполнено. · EN The multiplication is right but the final addition was not done. |
| 24 | — | UZ `Bu yerda qo'shish ayirishdan oldin ketgan. Ikkalasi bitta bosqichda, demak yozilish tartibi hal qiladi.` · RU Здесь сложение пошло раньше вычитания. Обе на одной ступени, значит решает порядок записи. · EN Here the addition went before the subtraction. Both are on one stage, so the written order decides. |

---

# Экран 12. ЛОВУШКА. Первая неверная строка

Прибор `AuditRows`. Тег Z1. Контрпример считает ученик.

**Бровка** — `Tuzoq` / Ловушка / The trap
**Заголовок** — `Xato birinchi qaysi qatorda` / В какой строке ошибка впервые / Where the mistake first appears

```
    1)   36 : 4 + 2 · 5 − 3
    2)   36 : 6 · 5 − 3
    3)   6 · 5 − 3
    4)   30 − 3
    5)   27
```

Верная строка — вторая. В ней сложены `4 + 2` раньше деления. Дальше всё честно, поэтому
искать надо первую неверную, а не любую.

**Озвучка**

1. мост. UZ `O'quvchi yechdi va xato qildi. Har bir qator to'g'ri ko'rinadi, javob esa noto'g'ri.` · RU Ученик решил и ошибся. Каждая строка выглядит верной, а ответ неверен. · EN A student solved it and got it wrong. Every line looks right, yet the answer is wrong.
2. UZ `Xato birinchi paydo bo'lgan qatorni toping. Har qanday noto'g'ri qatorni emas, aynan birinchisini.` · RU Найди строку, где ошибка появилась впервые. Не любую неверную, а именно первую. · EN Find the line where the mistake first appears. Not any wrong line, the first one.
3. по шагу `ok`. UZ `Topdingiz. Endi isbotlang. To'g'ri qiymatni o'zingiz hisoblang va yigirma yettining yoniga qo'ying.` · RU Нашёл. Теперь докажи. Посчитай верное значение сам и поставь его рядом с двадцатью семью. · EN You found it. Now prove it. Work out the correct value yourself and put it next to twenty-seven.
4. по шагу `proof`. UZ `O'n olti va yigirma yetti. Sonlar farq qildi, demak ikkinchi qator birinchisiga teng emas.` · RU Шестнадцать и двадцать семь. Числа разошлись — значит вторая строка не равна первой. · EN Sixteen and twenty-seven. The numbers differ, so the second line is not equal to the first.

**Разборы на неверно указанные строки**

| Строка | Разбор |
|---|---|
| 1 | UZ `Bu boshlang'ich yozuv, unda hali hech narsa hisoblanmagan.` · RU Это исходная запись, в ней ещё ничего не посчитано. · EN That is the original expression, nothing has been worked out in it yet. |
| 3 | UZ `Bu qatorga oltilik yuqoridan tushgan, boshlang'ich yozuvda esa u yo'q. Demak farq undan oldin paydo bo'lgan.` · RU В эту строку шестёрка пришла сверху, а в исходной записи её нет. Значит расхождение появилось раньше. · EN The six in this line came from above, and it is not in the original. So the divergence happened earlier. |
| 4 | UZ `Bu yerda ko'paytirish to'g'ri bajarilgan. Yuqoriroqqa qarang.` · RU Здесь умножение сделано верно. Смотри выше. · EN The multiplication here is correct. Look higher up. |
| 5 | UZ `Bu yerda ayirish to'g'ri. Xato bundan ancha oldin.` · RU Здесь вычитание верное. Ошибка старше. · EN The subtraction here is fine. The mistake is older than this. |

---

# Экран 13. ПЕРЕНОС. Обратная задача

Прибор `BracketGap`. Тег Z4. Два шага.

**Бровка** — `Teskari masala` / Обратная задача / The other way round
**Заголовок** — `Qiymat berilgan, yozuvni yig'ing` / Значение дано, собери запись / The value is given, build the expression

**Шаг 1.** Запись `12 − 8 : 2`, требуемое значение `2`. Верно: `(12 − 8) : 2`.
Без скобок запись даёт 8.

**Шаг 2.** Запись `20 − 4 · 3`, требуемое значение `48`. Верно: `(20 − 4) · 3`.
Без скобок запись даёт 8. Те же числа, а скобка переводит значение с 8 на 48.

**Шаг 3 — правило 4 учебника, вложенные скобки.** Решение методиста 2026-08-13: правило 4
ученик **проживает рукой**, а не читает. Внутренняя скобка на экране уже стоит и уже
сработала — в записи она занимает одну клетку с подписью `(4 + 2)`, а в счёте участвует
как число 6. Ученик ставит **внешнюю** скобку:

```
        (4 + 2) · 3 − 6 : 4          без внешней скобки = 16,5
       ((4 + 2) · 3 − 6) : 4         = 3
```

Проверка: `4 + 2 = 6`, `6 · 3 = 18`, `18 − 6 = 12`, `12 : 4 = 3`.

Разборы: постановка `((4 + 2) · 3)` ничего не меняет — умножение и так было первым;
постановка `(6 : 4)` тоже ничего не меняет — деление и так было последним; общий разбор
указывает на признак: «чтобы получилось три, делимое должно быть двенадцать».

**Озвучка**

1. мост. UZ `Butun dars davomida yozuv qiymatni berardi. Endi teskarisi.` · RU Весь урок запись задавала значение. Теперь наоборот. · EN All lesson the expression gave the value. Now it is the other way round.
2. UZ `Qiymat ikki bo'lishi kerak. Qavsni shunday qo'yingki, shu son chiqsin.` · RU Значение должно быть равно двум. Поставь скобку так, чтобы получилось именно оно. · EN The value has to be two. Place the bracket so that this is what comes out.
3. по шагу `ok1`. UZ `Bo'ldi. Bitta qavs sakkizni ikkiga aylantirdi.` · RU Готово. Одна скобка превратила восемь в двойку. · EN Done. A single bracket turned eight into two.
4. по шагу `mount2`. UZ `Oxirgi holat. Bu yerda qavs ichida yana qavs bor. Qaysi biri birinchi ishlashini belgilang.` · RU Последний случай. Здесь внутри скобки стоит ещё одна. Отметь, какая срабатывает первой. · EN The last case. Here one bracket sits inside another. Mark which one acts first.
5. по шагу `ok2`. UZ `Eng ichkaridagi birinchi. Darslikning to'rtinchi qoidasi shu haqda.` · RU Самая внутренняя — первой. Об этом четвёртое правило учебника. · EN The innermost one goes first. That is the textbook's fourth rule.

**Разборы шага 1**

| Ученик поставил | Значение | Разбор |
|---|---|---|
| `12 − (8 : 2)` | 8 | UZ `Qavs hech narsani o'zgartirmadi, bo'lish baribir birinchi edi. Ayirishni qavs ichiga oling.` · RU Скобка ничего не изменила: деление и так было первым. Возьми в скобку вычитание. · EN The bracket changed nothing, the division was first anyway. Put the subtraction inside it. |
| скобка не поставлена | 8 | UZ `Sakkiz bu qavssiz yozuvning qiymati. Bizga esa ikki kerak.` · RU Восемь — это значение записи без скобок. А нам нужна двойка. · EN Eight is the value with no brackets at all. We need a two. |

---

# Экран 14. БЛИЦ. Единственный оцениваемый экран

Четыре вопроса в одной панели. Отвеченный схлопывается в строку. Балл за первую попытку.

**Бровка** — `Blits` / Блиц / Quick round
**Заголовок** — `To'rt savol` / Четыре вопроса / Four questions

**Мост** UZ `Blits. To'rt savol. Bu darsdagi yagona baholanadigan ekran, shuning uchun shoshilmang.` · RU Блиц: четыре вопроса. Это единственный оцениваемый экран урока, поэтому не спеши. · EN Quick round: four questions. This is the only graded screen of the lesson, so take your time.

### Q1. `10 + 2 · 3`, верно 16

| Вариант | Тег | Разбор |
|---|---|---|
| 36 | Z1 | UZ `Bu o'n va ikkini qo'shib, keyin uchga ko'paytirgani. Ko'paytirish qaysi ikkita songa tegishli ekaniga qarang.` · RU Это десять и два сложены, а потом умножено на три. Посмотри, к каким двум числам относится умножение. · EN That is ten and two added and then multiplied by three. Look at which two numbers the multiplication belongs to. |
| 15 | — | UZ `Bu yerda hammasi qo'shilgan. Uchlik oldida ko'paytirish belgisi turibdi.` · RU Здесь всё сложено. Перед тройкой стоит знак умножения. · EN Here everything was added. The sign before the three is multiplication. |
| 60 | — | UZ `Bu yerda hammasi ko'paytirilgan. Ikkilik oldida esa qo'shish belgisi bor.` · RU Здесь всё перемножено. А перед двойкой стоит знак сложения. · EN Here everything was multiplied. But the sign before the two is addition. |

### Q2. `36 : 6 · 3`, верно 18

| Вариант | Тег | Разбор |
|---|---|---|
| 2 | Z2 | UZ `Ko'paytirish bo'lishdan oldin ketdi. Ikkalasi bitta bosqichda, demak yozilish tartibi hal qiladi.` · RU Умножение пошло раньше деления. Обе на одной ступени, значит решает порядок записи. · EN The multiplication went before the division. Both are on one stage, so the written order decides. |
| 6 | — | UZ `Bu faqat bo'lish. Uchga ko'paytirish bajarilmay qoldi.` · RU Это только деление. Умножение на три осталось несделанным. · EN That is the division only. The multiplication by three was never done. |
| 108 | — | UZ `Bu yerda o'ttiz oltini uchga ko'paytirgansiz. Oltilik oldida bo'lish belgisi turibdi.` · RU Здесь тридцать шесть умножено на три. А перед шестёркой стоит знак деления. · EN Here thirty-six was multiplied by three. But the sign before the six is division. |

### Q3. `(7 + 3) · 2`, верно 20

| Вариант | Тег | Разбор |
|---|---|---|
| 13 | Z4 | UZ `Bu qavssiz yozuvning qiymati. Qavs qo'shishni birinchi qiladi.` · RU Это значение записи без скобок. Скобка делает сложение первым. · EN That is the value with the brackets removed. The bracket makes the addition first. |
| 12 | — | UZ `Bu yerda hammasi qo'shilgan. Qavs oldida esa ko'paytirish belgisi turibdi.` · RU Здесь всё сложено. А перед скобкой стоит знак умножения. · EN Here everything was added. But the sign before the bracket is multiplication. |
| 42 | — | UZ `Bu yerda qavs ichida uch va to'rt emas, boshqa amal bajarilgan. Qavs ichiga qarang.` · RU Здесь внутри скобки выполнено не то действие. Посмотри, какой знак стоит между семёркой и тройкой. · EN Here the wrong operation was done inside the bracket. Look at the sign between the seven and the three. |

### Q4. Терминологический

Вопрос: `Sonli ifodaning qiymati nima?` / Что такое значение числового выражения? / What is the value of a numerical expression?

| Вариант | Тег | Разбор |
|---|---|---|
| **число, полученное в результате указанных действий** — UZ `ko'rsatilgan amallarni bajarish natijasida hosil bo'lgan son` / EN the number obtained by carrying out the operations shown | — | верный |
| сама запись из чисел и знаков — UZ `sonlar va belgilardan iborat yozuvning o'zi` / EN the written line of numbers and signs itself | Z6 | UZ `Bu ifodaning o'zi. Qiymat esa son, uni hisoblab olamiz.` · RU Это само выражение. А значение — это число, его мы получаем счётом. · EN That is the expression itself. The value is a number, and we get it by working the expression out. |
| знак действия в записи — UZ `yozuvdagi amal belgisi` / EN the operation sign in the expression | Z6 | UZ `Belgi nima qilishni ko'rsatadi, lekin son emas. Qiymat har doim son bo'ladi.` · RU Знак показывает, что делать, но числом не является. Значение — всегда число. · EN A sign tells you what to do but is not a number. A value is always a number. |
| порядок, в котором считают — UZ `hisoblash tartibi` / EN the order in which you count | Z6 | UZ `Tartib qiymatni topishga yordam beradi, lekin qiymatning o'zi emas.` · RU Порядок помогает найти значение, но самим значением не является. · EN The order helps you find the value but is not the value itself. |

---

# Экран 15. ИТОГ

Поле `ok`. Новой математики, нового ввода и нового вопроса нет.

**Бровка** — `Yakun` / Итог / Wrap-up
**Заголовок** — `Bitta yozuv — bitta qiymat` / Одна запись — одно значение / One expression, one value

**Левая колонка.** Бирюзовая плашка прогноза с экрана 1 рядом с зелёной плашкой результата.
Кольцо готовности по первым попыткам блица. Пробел называется словами.

| 4 из 4 | UZ `Bu turdagi masalalar yopildi.` / RU Этот тип задач закрыт. / EN This type of task is done. |
|---|---|
| 3 из 4 | UZ `Bitta joy takrorlashni talab qiladi` плюс название тега / RU «Одно место требует повтора» плюс название тега / EN “One spot needs another look” plus the tag |
| 2 и меньше | UZ `Sakkizinchi ekrandagi qoidaga va teg paydo bo'lgan ekranga qayting.` / RU Вернись к правилу на экране восемь и к экрану, где появился тег. / EN Go back to the rule on screen eight and to the screen where the tag appeared. |

**Мост к следующему уроку**

UZ `Keyingi darsda yozuvda son o'rniga harf paydo bo'ladi, tartib esa o'sha-o'sha qoladi.`
RU В следующем уроке в записи вместо числа появится буква, а порядок останется тем же.
EN In the next lesson a letter appears in place of a number, and the order stays the same.

**Правая колонка. Что я теперь умею** — от первого лица, четыре строки.

| UZ | RU | EN |
|---|---|---|
| `Sonli ifodaning qiymatini topa olaman.` | Я нахожу значение числового выражения. | I can find the value of a numerical expression. |
| `Qaysi amal birinchi ekanini bosqich bo'yicha ayta olaman.` | Я определяю по ступени, какое действие первое. | I can tell which operation goes first by its stage. |
| `Bitta bosqich ichida chapdan o'ngga hisoblayman.` | Внутри одной ступени я считаю слева направо. | Inside one stage I count from left to right. |
| `Qavs yozuvni qanday o'zgartirishini ko'rsata olaman.` | Я показываю, как скобка меняет запись. | I can show how a bracket changes the expression. |

Ниже — заметки ученика и кнопка печати шпаргалки.

**FactCard**

UZ `Amallar tartibi maktab shartliligi emas. Dasturlash tillarida amallar ustunligi alohida jadvalda yozib qo'yilgan, aks holda bitta kod qatori har xil mashinada har xil son berardi. Birinchi ekrandagi ikkita kalkulyator bilan aynan shu bo'lgan.`

RU Порядок действий — не школьная условность. В языках программирования старшинство операций
записано отдельной таблицей, иначе одна и та же строка кода давала бы на разных машинах разные
числа. Ровно это и произошло с двумя калькуляторами на первом экране.

EN The order of operations is not a school convention. Programming languages write operator
precedence down in a table of its own; otherwise the same line of code would give different
numbers on different machines. That is exactly what happened with the two calculators on the
first screen.

**Озвучка итога**

1. мост. UZ `Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz va mana qanday chiqdi.` · RU Вернёмся к началу. Вот что ты предполагал и вот как оказалось. · EN Back to the start. This is what you predicted and this is how it turned out.
2. UZ `Ikkala kalkulyator ham o'z qoidasi bo'yicha ishlagan. Matematika esa bitta qoidani tanlagan, va endi siz uni bilasiz.` · RU Оба калькулятора работали по своему правилу. Математика выбрала одно, и теперь ты его знаешь. · EN Both calculators followed their own rule. Mathematics picked one, and now you know it.
3. UZ `Keyingi darsda yozuvda harf paydo bo'ladi. Tartib esa o'zgarmaydi.` · RU В следующем уроке в записи появится буква. Порядок при этом не изменится. · EN In the next lesson a letter appears in the expression. The order does not change.

---

## Что проверено в этом контенте

- узбекская колонка: кириллицы нет, апостроф везде ASCII `'`, обращение `siz`;
- русская колонка: «ты», прошедшее время без привязки к полу;
- в озвучке нет знаков `= : · − ≠ %`, кавычек и длинных тире; все числа и действия словами;
- слово «неверно» не произносится ни в одном разборе;
- у каждого неверного варианта свой разбор, и каждый называет признак, а не ответ;
- ровно 4 варианта на экранах 1, 6 и в каждом вопросе блица;
- термины и определения на экране 8 — дословно из учебника, § 1, стр. 12, обе колонки;
- арифметика всех вариантов пересчитана.

**Английская колонка — draft.** Английского издания учебника нет, определения переведены нами.
Узбекская колонка draft не требует: она взята из узбекского издания дословно.

---

## Что изменилось при сборке, 2026-08-13

Всё ниже — следствие измерения, а не вкуса. Бюджет высоты 400 пикселей на ноутбуке
1366×615 и 520 на телефоне 390 (§ 6.1 эталона). Замер: 348 измерений точечной проверкой
плюс полный прогон.

| Экран | Было в этом документе | Стало | Почему |
|---:|---|---|---|
| 1 | место под разбор занято с первой секунды | место не резервируется, освобождается схлопыванием вариантов | занятое место давало 80 px сверх бюджета на ноутбуке и 81 на телефоне |
| 8 | четыре правила учебника дословно на карточке | два определения дословно плюс формула порядка; четыре правила дословно — в печатной шпаргалке | решение методиста 2026-08-13 |
| 12 | текст задания стоит над сборкой контрпримера | задание только произносится и стоит в заголовке | строки решения плюс задание давали 84 px сверх бюджета |
| 13 | два шага | три шага, третий — вложенные скобки взаимодействием | решение методиста 2026-08-13 |
| 15 | «Знаешь ли ты» тремя предложениями | двумя: третье повторяло хук | третье предложение давало 37 px сверх бюджета на телефоне |
| 15 | прогноз и результат — четыре блока | две строки «метка плюс текст» | четыре блока не оставляли места строке тегов |
| 15 | пробел называется списком всех тегов | называются два, остальные числом | шесть тегов растягивали строку за бюджет |

**Что при этом не менялось:** ни одно число, ни один верный ответ, ни один разбор.

---

## Слой движения, 2026-08-13

Решение методиста: на экранах 2–3 и 7–8 нужно объяснение движением. Правило, которому
подчинён весь слой: **движение включается только после того, как ответ уже добыт**. До
ответа оно превратило бы прибор в оракула (§ 8.1).

| Экран | Когда включается | Что делает |
|---:|---|---|
| 2 | после верного ответа | запись сворачивается сама: пара сближается, гаснет, на её месте вспыхивает результат |
| 3 | после расстановки порядка | две дорожки сворачиваются одновременно и расходятся на 8 и 20 |
| 5 | как объяснение | семь кадров: `18 − 6 : 3 + 4` сворачивается по ступеням до 20 |
| 7 | после расстановки порядка | две дорожки расходятся на 12 и 18 |
| 8 | после сборки правила | закон загорается по частям, снизу проходит подсветка «слева направо» |

Свёртка **вычисляется из порядка**, а не прописана вручную: одна дорожка работает на любой
записи и любом порядке, поэтому пригодна всем 48 урокам.

### Кадры экрана 3 (без результата)

| | UZ | RU | EN |
|---|---|---|---|
| 1 | `Bitta yozuv. Ikki mashina uni har xil o'qidi.` | Одна запись. Две машины прочитали её по-разному. | One expression. Two machines read it differently. |
| 2 | `Qaysi amal birinchi ketishini TARTIB hal qiladi. Tartibni o'zingiz qo'ying.` | Какое действие идёт первым, решает порядок. Поставь порядок сам. | Which operation goes first is decided by the order. Set the order yourself. |

### Кадры экрана 5 (со свёрткой)

| | RU |
|---|---|
| 1 | Сложение и вычитание — первая ступень, умножение и деление — вторая. |
| 2 | Вторая ступень идёт раньше. Шесть разделить на три. |
| 3 | Получилось два. Осталась только первая ступень. |
| 4 | Внутри одной ступени — слева направо. Восемнадцать минус два. |
| 5 | Получилось шестнадцать. |
| 6 | Последнее действие. Шестнадцать плюс четыре. |
| 7 | Двадцать. Это и есть значение записи. Теперь запиши тот же путь строками, как в тетради. |

Узбекская и английская колонки — в файле урока, `S5.film`. Каждому кадру отвечает свой
кусок озвучки: кадр меняется, когда кончился кусок, а при выключенном звуке — по таймеру.

### Кадры экрана 7 (без результата)

| | RU |
|---|---|
| 1 | Здесь и вычитание, и сложение — первая ступень. |
| 2 | Старшинства между ними нет. Расставь порядок и посмотри на оба числа. |

### Закон экрана 8

Чипы `( )` → `III` → `II` → `I` загораются по очереди через 0,42 с. Под ними строка
`внутри одной ступени — слева направо` / `bitta bosqich ichida — chapdan o'ngga` с
подсветкой, идущей слева направо.

### Два дефекта, найденные этим слоем

**Кадры пропускались целиком при неработающем TTS.** Очередь озвучки в этом случае
пролетает мгновенно, и экран 5 сразу показывал прибор. Поставлен пол: кадр не меняется
быстрее 1,5 с. Это обратная сторона сторожа из § 7.2 — тот спасает от зависания, этот от
проскакивания.

**Знак между карточками хука становился `=`.** После того как правило собрано, `8` и `20`
по-прежнему не равны: зелёный отмечает, какое число **является значением**, а не
равенство. Знак `≠` остаётся всегда.

### Экран 12: строка «доказательство» убрана

Была строка «Во второй строке сложены 4 и 2, а деление должно было идти раньше». Убрана по
двум причинам, и высота из них вторая:

1. § 8.2 требует, чтобы ошибку доказывал **ученик** числом. Программа, произносящая вывод
   до того, как он поставил контрпример, обесценивает задание.
2. Строки решения плюс эта строка плюс сборка контрпримера давали 17 пикселей сверх
   бюджета на ноутбуке — найдено полным прогоном на 4050 измерений.

Вывод никуда не делся: он появляется в `checkNote` **после** того, как ученик поставил 16.
