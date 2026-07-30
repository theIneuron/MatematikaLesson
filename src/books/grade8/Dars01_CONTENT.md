# Контент урока 1 — рациональные выражения и рациональные дроби

## 1. Назначение

Документ содержит утверждаемую основу контента для реализации
`src/components/grade8/Dars01.jsx`.

Языки:

- `uz` — узбекский;
- `ru` — русский;
- `en` — английский.

Все три версии:

- используют одинаковые формулы и числа;
- требуют одинаковых действий;
- имеют одинаковые правильные ответы;
- содержат равнозначные подсказки;
- передают одинаковые диагностические теги;
- озвучиваются отдельной TTS-локалью.

Сценарная основа: `Dars01_SCENARIO.md`.

---

## 2. Технический языковой контракт

Каждая пользовательская строка хранится в объекте:

```js
{
  uz: '...',
  ru: '...',
  en: '...'
}
```

Требования к реализации:

```js
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];

const TTS_LOCALES = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
  en: 'en-GB',
};
```

- бинарный тернарий `uz ? ... : ru` запрещён;
- отсутствие любого языка считается ошибкой в режиме разработки;
- `lang="en"` не должен использовать русскую строку как незаметный fallback;
- переключение языка не сбрасывает экран, ответы, гипотезу или попытки;
- answer ID и математические значения не зависят от языка;
- переключатель содержит `UZ`, `RU`, `EN`, без флагов;
- формулы хранятся отдельно от переводимого текста.

---

## 3. Общие элементы интерфейса

| ID | UZ | RU | EN |
|---|---|---|---|
| `nav.back` | Orqaga | Назад | Back |
| `nav.next` | Davom etish | Далее | Continue |
| `nav.check` | Tekshirish | Проверить | Check |
| `nav.retry` | Qayta urinib ko‘ring | Попробовать снова | Try again |
| `nav.finish` | Darsni yakunlash | Завершить урок | Finish lesson |
| `nav.restart` | Qaytadan boshlash | Начать заново | Start again |
| `audio.listen` | Tinglash | Прослушать | Listen |
| `audio.replay` | Qayta tinglash | Повторить | Replay |
| `audio.on` | Ovozni yoqish | Включить звук | Turn sound on |
| `audio.off` | Ovozni o‘chirish | Выключить звук | Turn sound off |
| `feedback.correct` | To‘g‘ri | Верно | Correct |
| `feedback.hint` | Maslahat | Подсказка | Hint |
| `feedback.review` | Yana tekshiring | Проверь ещё раз | Check again |
| `feedback.undefined` | Aniqlanmagan | Не определено | Undefined |
| `value.allowed` | Mumkin | Допустимо | Allowed |
| `value.excluded` | Mumkin emas | Запрещено | Excluded |
| `field.numerator` | Surat | Числитель | Numerator |
| `field.denominator` | Maxraj | Знаменатель | Denominator |

---

## 4. Экран 0 — проблема

### Экранный текст

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | MUAMMO | ПРОБЛЕМА | PROBLEM |
| Заголовок | Nega formula o‘zgaruvchining har bir qiymatini qabul qilmaydi? | Почему формула принимает не каждое значение переменной? | Why does the formula not accept every value of the variable? |
| Вводный текст | Formulani tekshirishda hisoblab bo‘lmaydigan kirish qiymati topildi. Uni aniqlang va matematik sababini tushuntiring. | При проверке формулы обнаружено входное значение, при котором расчёт невозможен. Найди его и объясни математическую причину. | Testing the formula revealed an input value for which the calculation is impossible. Find it and explain the mathematical reason. |
| Кнопка | Formulani tadqiq qilish | Исследовать формулу | Investigate the formula |

Центральная формула:

\[
K(x)=\frac{2x+1}{x-3}
\]

Значения:

```text
x = 0    x = 2    x = 3    x = 4
```

### TTS

| UZ | RU | EN |
|---|---|---|
| Ka iks teng kasrga: suratda ikki iks qo‘shilgan bir, maxrajda iks ayirilgan uch. Formulani hisoblab bo‘lmaydigan qiymatni toping va sababini tushuntiring. | Ка от икс равно дроби: два икс плюс один в числителе, икс минус три в знаменателе. Найди значение, при котором формулу нельзя вычислить, и объясни причину. | K of x equals the fraction with two x plus one in the numerator and x minus three in the denominator. Find the value for which the formula cannot be calculated, and explain why. |

Ответ не оценивается. Событие завершения: `investigation_started`.

---

## 5. Экран 1 — необходимые знания

### Заголовок и инструкция

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | ZARUR BILIMLAR | ЧТО УЖЕ ИЗВЕСТНО | SKILLS CHECK |
| Заголовок | Kerakli bilimlarni tekshiring | Проверь необходимые знания | Check the skills you need |
| Инструкция | Uchta qisqa topshiriqni bajaring. Bu yangi mavzu bo‘yicha baho emas. | Выполни три коротких задания. Это не оценка по новой теме. | Complete three short tasks. This is not a test on the new topic. |

### Микрошаг A

\[
2x+1,\qquad x=2
\]

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Вопрос | Ifodaning qiymatini toping. | Найди значение выражения. | Find the value of the expression. |
| Верно | To‘g‘ri. \(x\) o‘rniga 2 ni qo‘ysak, \(2\cdot2+1=5\). | Верно. После подстановки \(x=2\): \(2\cdot2+1=5\). | Correct. Substituting \(x=2\) gives \(2\cdot2+1=5\). |
| Подсказка 1 | \(x\) o‘rniga 2 ni qo‘ying. | Подставь 2 вместо \(x\). | Substitute 2 for \(x\). |
| Подсказка 2 | Avval \(2\cdot2\) ni hisoblang. | Сначала вычисли \(2\cdot2\). | Calculate \(2\cdot2\) first. |

Ответ: `5`.

### Микрошаг B

\[
\frac{5}{x-3}
\]

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Вопрос | Kasrning maxrajini ko‘rsating. | Укажи знаменатель дроби. | Identify the denominator of the fraction. |
| Верно | To‘g‘ri. Kasr chizig‘i ostidagi \(x-3\) ifoda maxrajdir. | Верно. Выражение \(x-3\) под дробной чертой является знаменателем. | Correct. The expression \(x-3\) below the fraction bar is the denominator. |
| Подсказка | Kasr chizig‘i ostidagi butun ifodaga qarang. | Посмотри на всё выражение под дробной чертой. | Look at the entire expression below the fraction bar. |

Ответ ID: `x-minus-3`.

### Микрошаг C

\[
x-3=0
\]

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Вопрос | \(x\) ni toping. | Найди \(x\). | Solve for \(x\). |
| Верно | To‘g‘ri. \(x-3=0\) bo‘lsa, \(x=3\). | Верно. Если \(x-3=0\), то \(x=3\). | Correct. If \(x-3=0\), then \(x=3\). |
| Подсказка | Tenglikning ikki tomoniga 3 ni qo‘shing. | Прибавь 3 к обеим частям равенства. | Add 3 to both sides of the equation. |

Ответ: `3`.

### TTS

| UZ | RU | EN |
|---|---|---|
| Yangi g‘oyani o‘rganishdan oldin uchta kerakli ko‘nikmani tekshiramiz: qiymatni hisoblash, maxrajni topish va sodda tenglamani yechish. | Перед новой идеей проверим три необходимых навыка: вычисление значения, определение знаменателя и решение простого уравнения. | Before studying the new idea, check three required skills: evaluating an expression, identifying a denominator, and solving a simple equation. |

---

## 6. Экран 2 — структура выражений

Выражения:

\[
3x+1,\qquad x^2-4,\qquad \frac{5}{x-2},\qquad
\frac{x+1}{2x-3}.
\]

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | TUZILISH | НАБЛЮДЕНИЕ | STRUCTURE |
| Заголовок | Ifodalarni ikki guruhga ajrating | Раздели выражения на две группы | Sort the expressions into two groups |
| Инструкция | Har bir ifodada maxrajda o‘zgaruvchi bor yoki yo‘qligini tekshiring. | Проверь, есть ли переменная в знаменателе каждого выражения. | Check whether each expression has a variable in its denominator. |
| Группа A | Maxrajda o‘zgaruvchi yo‘q | В знаменателе нет переменной | No variable in the denominator |
| Группа B | Maxrajda o‘zgaruvchi bor | В знаменателе есть переменная | A variable is in the denominator |
| Верно | To‘g‘ri. Ikkinchi guruhdagi ifodalar uchun bo‘lish amalini bajarish mumkinligini alohida tekshirish kerak. | Верно. Для выражений второй группы нужно отдельно проверять, можно ли выполнить деление. | Correct. For expressions in the second group, you must check separately whether the division can be performed. |
| Подсказка | Kasr chizig‘i ostidagi qismga qarang. | Смотри на часть под дробной чертой. | Look at the part below the fraction bar. |

Правильная сортировка:

- A: `3x + 1`, `x² - 4`;
- B: `5/(x - 2)`, `(x + 1)/(2x - 3)`.

### TTS

| UZ | RU | EN |
|---|---|---|
| Ifodalarni tuzilishiga qarab ajrating. Asosiy belgi — o‘zgaruvchi maxrajda qatnashganmi yoki yo‘qmi. | Раздели выражения по структуре. Главный признак — находится ли переменная в знаменателе. | Sort the expressions by structure. The key feature is whether a variable appears in the denominator. |

---

## 7. Экран 3 — гипотеза

\[
K(x)=\frac{2x+1}{x-3}
\]

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | GIPOTEZA | ГИПОТЕЗА | HYPOTHESIS |
| Заголовок | Qaysi qiymat hisoblashni imkonsiz qilishi mumkin? | Какое значение может сделать вычисление невозможным? | Which value might make the calculation impossible? |
| Вопрос 1 | \(0\), \(2\), \(3\), \(4\) qiymatlaridan birini tanlang. | Выбери одно из значений: \(0\), \(2\), \(3\), \(4\). | Choose one of the values: \(0\), \(2\), \(3\), \(4\). |
| Вопрос 2 | Qaysi qismni avval tekshirish kerak? | Какую часть нужно проверить первой? | Which part should be checked first? |
| Причина A | Surat nolga teng bo‘ladi | Числитель станет равен нулю | The numerator will equal zero |
| Причина B | Maxraj nolga teng bo‘ladi | Знаменатель станет равен нулю | The denominator will equal zero |
| Причина C | Natija manfiy bo‘ladi | Результат станет отрицательным | The result will be negative |
| Причина D | O‘zgaruvchi ikki marta qatnashgan | Переменная встречается дважды | The variable appears twice |
| Кнопка | Gipotezani saqlash | Сохранить гипотезу | Save hypothesis |
| Подтверждение | Gipoteza saqlandi. Endi uni qiymatlar yordamida tekshiring. | Гипотеза сохранена. Теперь проверь её на значениях. | Hypothesis saved. Now test it using values. |

Гипотеза сохраняется без немедленной оценки. Ожидаемая версия: `x = 3`,
`denominator-zero`.

### TTS

| UZ | RU | EN |
|---|---|---|
| Hisoblamasdan oldin taxmin qiling. Qaysi qiymat muammo tug‘dirishi mumkin va ifodaning qaysi qismini avval tekshirish kerak? | Сделай прогноз до вычисления. Какое значение может вызвать проблему и какую часть выражения нужно проверить первой? | Make a prediction before calculating. Which value might cause a problem, and which part of the expression should be checked first? |

---

## 8. Экран 4 — лаборатория значений

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | TAJRIBA | ЭКСПЕРИМЕНТ | EXPERIMENT |
| Заголовок | Qiymatlar jadvalini to‘ldiring | Заполни таблицу значений | Complete the value table |
| Инструкция | Har bir \(x\) qiymatini tanlang. Avval surat va maxrajni, keyin \(K(x)\) ni hisoblang. | Выбирай каждое значение \(x\). Сначала вычисли числитель и знаменатель, затем \(K(x)\). | Select each value of \(x\). Calculate the numerator and denominator first, then calculate \(K(x)\). |
| Статус при \(x=3\) | Maxraj 0 ga teng. Nolga bo‘lish aniqlanmagan. | Знаменатель равен 0. Деление на ноль не определено. | The denominator equals 0. Division by zero is undefined. |
| Верно | Jadval to‘ldirildi. Faqat \(x=3\) da hisoblashni bajarib bo‘lmaydi. | Таблица заполнена. Только при \(x=3\) вычисление выполнить невозможно. | The table is complete. The calculation is impossible only when \(x=3\). |
| Подсказка | Har bir ustunni alohida hisoblang. Muammo natijada emas, bo‘lish amalida paydo bo‘lishi mumkin. | Вычисляй каждый столбец отдельно. Проблема может возникнуть не в результате, а в самом делении. | Calculate each column separately. The problem may occur in the division itself, not in the final result. |

Таблица:

| \(x\) | \(2x+1\) | \(x-3\) | \(K(x)\) |
|---:|---:|---:|---:|
| 0 | 1 | −3 | \(-\frac13\) |
| 2 | 5 | −1 | −5 |
| 3 | 7 | 0 | undefined |
| 4 | 9 | 1 | 9 |

Слово в последней ячейке локализуется:

```js
{
  uz: 'aniqlanmagan',
  ru: 'не определено',
  en: 'undefined'
}
```

### TTS

| UZ | RU | EN |
|---|---|---|
| To‘rtta qiymatni tekshiring. Iks uchga teng bo‘lganda surat yettiga, maxraj esa nolga teng bo‘ladi. Nolga bo‘lish aniqlanmagan. | Проверь четыре значения. При икс, равном трём, числитель равен семи, а знаменатель — нулю. Деление на ноль не определено. | Test all four values. When x equals three, the numerator equals seven and the denominator equals zero. Division by zero is undefined. |

---

## 9. Экран 5 — два разных нуля

\[
P(x)=\frac{x-3}{x+1},
\qquad
Q(x)=\frac{x+1}{x-3},
\qquad x=3.
\]

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | CHEGARAVIY HOLAT | ГРАНИЧНЫЙ СЛУЧАЙ | BOUNDARY CASE |
| Заголовок | Ikki xil nol | Два разных нуля | Two different zeros |
| Инструкция | Har ikkala ifodaga \(x=3\) ni qo‘ying va qaysi biri aniqlanganini belgilang. | Подставь \(x=3\) в оба выражения и укажи, какое из них определено. | Substitute \(x=3\) into both expressions and identify which one is defined. |
| Фраза | ___ dagi nol mumkin; ___ dagi nol bo‘lishni imkonsiz qiladi. | Ноль в ___ допустим; ноль в ___ делает деление невозможным. | Zero in the ___ is allowed; zero in the ___ makes division impossible. |
| Верно | To‘g‘ri. Nolli surat kasrning qiymatini nol qiladi. Nolli maxraj esa bo‘lishni aniqlanmagan qiladi. | Верно. Нулевой числитель делает значение дроби равным нулю. Нулевой знаменатель делает деление неопределённым. | Correct. A zero numerator makes the value of the fraction zero. A zero denominator makes the division undefined. |
| Подсказка 1 | \(0/4\) va \(4/0\) yozuvlarini solishtiring. | Сравни записи \(0/4\) и \(4/0\). | Compare \(0/4\) and \(4/0\). |
| Подсказка 2 | Qaysi yozuvda nolga bo‘lish talab qilinadi? | В какой записи требуется деление на ноль? | Which expression requires division by zero? |

Ответ:

\[
P(3)=0,\qquad Q(3)\text{ undefined}.
\]

Пропуски: `numerator`, `denominator`.

### TTS

| UZ | RU | EN |
|---|---|---|
| Nolning o‘rni muhim. Suratdagi nol ruxsat etiladi va kasrning qiymati nol bo‘ladi. Maxrajdagi nol esa nolga bo‘lishni talab qiladi. | Положение нуля имеет значение. Ноль в числителе допустим и даёт значение ноль. Ноль в знаменателе требует деления на ноль. | The position of zero matters. Zero in the numerator is allowed and gives a value of zero. Zero in the denominator requires division by zero. |

---

## 10. Экран 6 — открытие условия

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | QONUNIYAT | ЗАКОНОМЕРНОСТЬ | PATTERN |
| Заголовок | Shartni tuzing | Собери условие | Build the condition |
| Инструкция | Taqiqlangan qiymatni topish qadamlarini to‘g‘ri tartibga joylashtiring. | Расположи шаги поиска запрещённого значения в правильном порядке. | Put the steps for finding an excluded value in the correct order. |
| Шаг A | Maxrajni toping | Найти знаменатель | Identify the denominator |
| Шаг B | Maxraj qachon 0 bo‘lishini toping | Найти, когда знаменатель равен 0 | Find when the denominator equals 0 |
| Шаг C | Topilgan qiymatni chiqarib tashlang | Исключить найденное значение | Exclude the value found |
| Вывод | \(x-3\ne0\), demak \(x\ne3\). | \(x-3\ne0\), значит \(x\ne3\). | \(x-3\ne0\), so \(x\ne3\). |
| Верно | To‘g‘ri. Mumkin qiymatlar maxraj nolga teng bo‘lmasligi sharti bilan aniqlanadi. | Верно. Допустимые значения определяются условием, что знаменатель не равен нулю. | Correct. Permissible values are determined by the condition that the denominator is not zero. |
| Подсказка | Avval tekshiriladigan qismni toping, keyin nolga tenglikni yeching. | Сначала найди проверяемую часть, затем реши равенство с нулём. | First identify the part to check, then solve the equation with zero. |

Правильный порядок: `denominator → zero → exclude`.

### TTS

| UZ | RU | EN |
|---|---|---|
| Umumiy usulni tuzing: maxrajni toping, uning qachon nol bo‘lishini aniqlang va shu qiymatni mumkin qiymatlar orasidan chiqaring. | Собери общий способ: найди знаменатель, определи, когда он равен нулю, и исключи это значение. | Build the general method: identify the denominator, find when it equals zero, and exclude that value. |

---

## 11. Экран 7 — точные понятия

### Заголовок

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | QOIDA | ПРАВИЛО | RULE |
| Заголовок | Aniq matematik atamalar | Точные математические термины | Precise mathematical terms |
| Вводный текст | Tadqiqotda topilgan tuzilishlarni aniq nomlaymiz. | Назовём точно структуры, найденные в исследовании. | Let us name the structures found in the investigation precisely. |

### Определения

| Термин | UZ | RU | EN |
|---|---|---|---|
| Рациональное выражение | Ratsional ifoda sonlar va o‘zgaruvchilardan qo‘shish, ayirish, ko‘paytirish, bo‘lish va natural darajaga ko‘tarish amallari yordamida tuziladi. | Рациональное выражение составляется из чисел и переменных с помощью сложения, вычитания, умножения, деления и возведения в натуральную степень. | A rational algebraic expression is formed from numbers and variables using addition, subtraction, multiplication, division, and positive integer powers. |
| Целое рациональное выражение | Butun ratsional ifodada maxrajida o‘zgaruvchi qatnashgan ifodaga bo‘lish yo‘q. | В целом рациональном выражении нет деления на выражение, содержащее переменную. | A polynomial expression has no division by an expression containing a variable. |
| Рациональная дробь | Ratsional kasr \(\frac{A(x)}{B(x)}\) ko‘rinishida bo‘ladi, bu yerda \(A(x)\) va \(B(x)\) butun ratsional ifodalar hamda \(B(x)\ne0\). | Рациональная дробь имеет вид \(\frac{A(x)}{B(x)}\), где \(A(x)\) и \(B(x)\) — целые рациональные выражения и \(B(x)\ne0\). | A rational expression, also called a rational fraction in this course, has the form \(\frac{A(x)}{B(x)}\), where \(A(x)\) and \(B(x)\) are polynomial expressions and \(B(x)\ne0\). |
| Допустимые значения | Mumkin qiymatlarda ifodadagi barcha amallarni bajarish mumkin. | При допустимых значениях можно выполнить все действия в выражении. | At permissible values, every operation in the expression can be performed. |

### Классификация

Выражения:

\[
4x-7,\qquad
\frac{x+2}{5},\qquad
\frac{x+2}{x-5}.
\]

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Инструкция | Har bir ifodani «butun ratsional ifoda» yoki «ratsional kasr» guruhiga kiriting. | Отнеси каждое выражение к группе «целое рациональное выражение» или «рациональная дробь». | Classify each expression as a polynomial expression or a rational expression. |
| Верно | To‘g‘ri. Birinchi ikki ifodaning maxrajida o‘zgaruvchi yo‘q. Uchinchi ifoda \(x=5\) da aniqlanmagan. | Верно. В знаменателях первых двух выражений нет переменной. Третье выражение не определено при \(x=5\). | Correct. The first two expressions have no variable in a denominator. The third expression is undefined when \(x=5\). |
| Подсказка | Maxrajda o‘zgaruvchi qatnashganini tekshiring. | Проверь, содержится ли переменная в знаменателе. | Check whether a denominator contains a variable. |

Правильная классификация:

- `4x - 7` — whole;
- `(x + 2)/5` — whole;
- `(x + 2)/(x - 5)` — rational expression, `x ≠ 5`.

### TTS

TTS разбивается на три управляемых сегмента.

| Сегмент | UZ | RU | EN |
|---|---|---|---|
| 1 | Ratsional ifoda arifmetik amallar yordamida sonlar va o‘zgaruvchilardan tuziladi. | Рациональное выражение составляется из чисел и переменных с помощью арифметических действий. | A rational expression is formed from numbers and variables using arithmetic operations. |
| 2 | Agar maxrajda o‘zgaruvchi bo‘lmasa, bu butun ratsional ifodadir. | Если в знаменателе нет переменной, это целое рациональное выражение. | If no denominator contains a variable, the expression can be written as a polynomial expression. |
| 3 | Ratsional kasrda maxraj nolga teng bo‘lishi mumkin emas. | В рациональной дроби знаменатель не может быть равен нулю. | In a rational expression written as a fraction, the denominator cannot equal zero. |

---

## 12. Экран 8 — разобранный пример

\[
R(x)=\frac{3x-2}{x+4}.
\]

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | TAHLIL | РАЗБОР | WALKTHROUGH |
| Заголовок | Taqiqlangan qiymatni bosqichma-bosqich toping | Найди запрещённое значение по шагам | Find the excluded value step by step |
| Инструкция | Har bir qadam uchun matematik asosni tanlang. | Выбери математическое основание каждого шага. | Choose the mathematical reason for each step. |
| Основание A | Maxrajni tekshiramiz | Проверяем знаменатель | Check the denominator |
| Основание B | Nolga bo‘lish aniqlanmagan | Деление на ноль не определено | Division by zero is undefined |
| Основание C | Chiziqli tenglamani yechamiz | Решаем линейное уравнение | Solve the linear equation |
| Итог | \(x=-4\) taqiqlangan; boshqa qiymatlar mumkin. | \(x=-4\) запрещено; остальные значения допустимы. | \(x=-4\) is excluded; all other values are permissible. |
| Верно | To‘g‘ri. \(x+4=0\) bo‘lganda maxraj nolga teng bo‘ladi, shuning uchun \(x=-4\) ni chiqarib tashlaymiz. | Верно. При \(x+4=0\) знаменатель равен нулю, поэтому исключаем \(x=-4\). | Correct. When \(x+4=0\), the denominator equals zero, so \(x=-4\) is excluded. |
| Подсказка | Birinchi qadam har doim kasrning maxrajini topishdan boshlanadi. | Первый шаг начинается с определения знаменателя дроби. | The first step is to identify the denominator of the fraction. |

Шаги:

\[
x+4\ne0
\quad\Rightarrow\quad
x\ne-4.
\]

### TTS

| UZ | RU | EN |
|---|---|---|
| Maxraj iks qo‘shilgan to‘rt. U nolga teng bo‘lmasligi kerak. Iks qo‘shilgan to‘rt nolga teng bo‘lganda iks minus to‘rtga teng, shuning uchun minus to‘rt taqiqlanadi. | Знаменатель — икс плюс четыре. Он не должен быть равен нулю. Равенство икс плюс четыре равно нулю даёт икс равно минус четырём, поэтому минус четыре исключается. | The denominator is x plus four. It must not equal zero. Solving x plus four equals zero gives x equals negative four, so negative four is excluded. |

---

## 13. Экран 9 — практика с опорой

\[
F(x)=\frac{5}{2x-6}.
\]

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | TAYANCH BILAN TEKSHIRUV | ПРОВЕРКА С ОПОРОЙ | GUIDED CHECK |
| Заголовок | Shartni va taqiqlangan qiymatni to‘ldiring | Заполни условие и запрещённое значение | Complete the condition and excluded value |
| Инструкция | Bo‘sh joylarga mos belgini va sonni kiriting. | Вставь подходящий знак и число. | Enter the correct sign and number. |
| Верно | To‘g‘ri. \(2x-6\ne0\), shuning uchun \(x\ne3\). | Верно. \(2x-6\ne0\), поэтому \(x\ne3\). | Correct. \(2x-6\ne0\), so \(x\ne3\). |
| Подсказка 1 | \(2x-6\) qachon nolga teng bo‘lishini toping. | Найди, когда \(2x-6\) равно нулю. | Find when \(2x-6\) equals zero. |
| Подсказка 2 | Tekshiriladigan ifoda maxrajda joylashgan. | Проверяемое выражение находится в знаменателе. | The expression to check is in the denominator. |
| Подсказка 3 | \(2x=6\). Endi \(x\) ni toping. | \(2x=6\). Теперь найди \(x\). | \(2x=6\). Now solve for \(x\). |

Заполняемые выражения:

\[
2x-6\ \boxed{\ne}\ 0,
\qquad
x\ \boxed{\ne}\ 3.
\]

### TTS

| UZ | RU | EN |
|---|---|---|
| Maxraj ikki iks ayirilgan olti. U nolga teng bo‘lmasligi kerak. Maxrajni nolga tenglashtirib, chiqarib tashlanadigan qiymatni toping. | Знаменатель — два икс минус шесть. Он не должен быть равен нулю. Приравняй знаменатель к нулю и найди исключаемое значение. | The denominator is two x minus six. It must not equal zero. Set the denominator equal to zero and find the value to exclude. |

---

## 14. Экран 10 — выбор стратегии

\[
G(x)=\frac{x+1}{3x-9}.
\]

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | USUL TANLASH | ВЫБОР СПОСОБА | STRATEGY |
| Заголовок | Qaysi usul barcha qiymatlarni hisobga oladi? | Какой способ учитывает все значения? | Which method accounts for every value? |
| Способ A | \(0,1,2,3,4,\ldots\) qiymatlarini birma-bir qo‘yish. | Подставлять значения \(0,1,2,3,4,\ldots\) по очереди. | Substitute \(0,1,2,3,4,\ldots\) one at a time. |
| Способ B | \(3x-9=0\) tenglamani yechish. | Решить уравнение \(3x-9=0\). | Solve the equation \(3x-9=0\). |
| Вопрос | Qaysi usul taqiqlangan qiymat haqida to‘liq xulosa beradi? | Какой способ даёт полный вывод о запрещённом значении? | Which method gives a complete conclusion about the excluded value? |
| Верно | B usul to‘liq: \(3x-9=0\) faqat \(x=3\) da bajariladi. | Способ B полный: равенство \(3x-9=0\) выполняется только при \(x=3\). | Method B is complete: \(3x-9=0\) only when \(x=3\). |
| При выборе A | Ayrim qiymatlarni tekshirish muammoni topishi mumkin, ammo barcha sonlar tekshirilganini isbotlamaydi. | Проверка отдельных значений может обнаружить проблему, но не доказывает, что проверены все числа. | Testing individual values may reveal a problem, but it does not prove that every number has been checked. |

Ответ ID: `solve-denominator`.

### TTS

| UZ | RU | EN |
|---|---|---|
| Qiymatlarni birma-bir tekshirish mumkin, lekin sonlar cheksiz ko‘p. Maxrajni nolga tenglashtirish to‘liq va ishonchli usul beradi. | Можно проверять значения по одному, но чисел бесконечно много. Приравнивание знаменателя к нулю даёт полный и надёжный способ. | Values can be tested one by one, but there are infinitely many numbers. Setting the denominator equal to zero gives a complete and reliable method. |

---

## 15. Экран 11 — самостоятельное применение

\[
A(x)=x^2-5x+4,
\qquad
B(x)=\frac{x+7}{x-5}.
\]

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | MUSTAQIL | САМОСТОЯТЕЛЬНО | INDEPENDENT |
| Заголовок | Ifodaning turini va cheklovini aniqlang | Определи тип выражения и ограничение | Identify the expression type and restriction |
| Инструкция | Har bir ifodani tasniflang. Bo‘lish bilan bog‘liq taqiqlangan qiymat bo‘lsa, uni kiriting. | Классифицируй каждое выражение. Если есть запрещённое из-за деления значение, введи его. | Classify each expression. If division creates an excluded value, enter it. |
| Ответ A | Butun ratsional ifoda; bo‘lishdan kelib chiqadigan cheklov yo‘q. | Целое рациональное выражение; ограничений из-за деления нет. | Integral rational expression; there is no restriction caused by division. |
| Ответ B | Ratsional kasr; \(x=5\) taqiqlangan. | Рациональная дробь; \(x=5\) запрещено. | Rational fraction; \(x=5\) is excluded. |
| Верно | To‘g‘ri. Cheklov ifodada o‘zgaruvchi qatnashgan maxraj paydo bo‘lganda tekshiriladi. | Верно. Ограничение нужно проверять, когда в выражении появляется знаменатель с переменной. | Correct. A restriction must be checked when an expression has a denominator containing a variable. |
| Подсказка | Har bir ifodada kasr chizig‘i va o‘zgaruvchili maxraj borligini tekshiring. | Проверь наличие дробной черты и знаменателя с переменной. | Check for a fraction bar and a denominator containing a variable. |

### TTS

| UZ | RU | EN |
|---|---|---|
| Endi ikki ifodani mustaqil tasniflang. Faqat ifodaning tashqi ko‘rinishiga emas, maxrajda o‘zgaruvchi borligiga e’tibor bering. | Теперь самостоятельно классифицируй два выражения. Смотри не только на внешний вид, а на наличие переменной в знаменателе. | Now classify two expressions independently. Do not rely only on appearance; check whether a variable occurs in a denominator. |

---

## 16. Экран 12 — анализ ошибки

\[
H(x)=\frac{x-4}{x+2}.
\]

Решение:

```text
1. При x = 4 числитель равен нулю.
2. Поэтому x = 4 — запрещённое значение.
3. Других ограничений нет.
```

Локализованные строки решения:

| Шаг | UZ | RU | EN |
|---:|---|---|---|
| 1 | \(x=4\) da surat nolga teng. | При \(x=4\) числитель равен нулю. | When \(x=4\), the numerator equals zero. |
| 2 | Shuning uchun \(x=4\) taqiqlangan qiymat. | Поэтому \(x=4\) — запрещённое значение. | Therefore, \(x=4\) is an excluded value. |
| 3 | Boshqa cheklovlar yo‘q. | Других ограничений нет. | There are no other restrictions. |

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | MODEL XATOSI | ОШИБКА МОДЕЛИ | MODEL ERROR |
| Заголовок | Birinchi noto‘g‘ri xulosani toping | Найди первый неверный вывод | Find the first incorrect conclusion |
| Инструкция | Noto‘g‘ri qadamni belgilang va yechimni tuzating. | Отметь неверный шаг и исправь решение. | Mark the incorrect step and correct the solution. |
| Верно | To‘g‘ri. 2-qadam noto‘g‘ri. \(x=4\) da kasr 0 ga teng va aniqlangan. Asl cheklov \(x+2\ne0\), ya’ni \(x\ne-2\). | Верно. Шаг 2 неверен. При \(x=4\) дробь равна 0 и определена. Настоящее ограничение: \(x+2\ne0\), то есть \(x\ne-2\). | Correct. Step 2 is incorrect. When \(x=4\), the fraction equals 0 and is defined. The actual restriction is \(x+2\ne0\), so \(x\ne-2\). |
| Подсказка 1 | Nolga teng bo‘lgan qism suratmi yoki maxrajmi? | Какая часть равна нулю: числитель или знаменатель? | Which part equals zero: the numerator or the denominator? |
| Подсказка 2 | \(x+2=0\) tenglamani yeching. | Реши уравнение \(x+2=0\). | Solve the equation \(x+2=0\). |

Ответ: первый неверный шаг `2`, исправление `x ≠ -2`.

### TTS

| UZ | RU | EN |
|---|---|---|
| Yechimning har bir qadamini tekshiring. Nolli surat ruxsat etilganini, cheklov esa maxrajdan kelib chiqishini eslang. | Проверь каждый шаг решения. Вспомни, что нулевой числитель допустим, а ограничение возникает из знаменателя. | Check each step of the solution. Remember that a zero numerator is allowed and that the restriction comes from the denominator. |

---

## 17. Экран 13 — обратная задача

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | KONSTRUKTOR | КОНСТРУКТОР | CONSTRUCTOR |
| Заголовок | Berilgan cheklovli ratsional kasr tuzing | Построй рациональную дробь с заданным ограничением | Build a rational expression with the given restriction |
| Задание | \(x=-2\) da aniqlanmagan ratsional kasr tuzing. | Построй рациональную дробь, не определённую при \(x=-2\). | Build a rational expression that is undefined when \(x=-2\). |
| Поле A | Suratni tanlang | Выбери числитель | Choose a numerator |
| Поле B | Maxrajni tanlang | Выбери знаменатель | Choose a denominator |
| Вопрос | Kasrning qaysi qismi \(x=-2\) dagi cheklovni ta’minlaydi? | Какая часть дроби обеспечивает запрет при \(x=-2\)? | Which part of the fraction creates the restriction at \(x=-2\)? |
| Верно | To‘g‘ri. \(x+2\) ham, \(2x+4\) ham \(x=-2\) da nolga teng bo‘ladi. Cheklovni maxraj yaratadi. | Верно. И \(x+2\), и \(2x+4\) равны нулю при \(x=-2\). Ограничение создаёт знаменатель. | Correct. Both \(x+2\) and \(2x+4\) equal zero when \(x=-2\). The denominator creates the restriction. |
| Подсказка | \(x=-2\) ni har bir maxraj variantiga qo‘ying. | Подставь \(x=-2\) в каждый вариант знаменателя. | Substitute \(x=-2\) into each denominator option. |

Варианты:

```text
numerators:  x + 1,  3x - 5,  7
denominators: x - 2,  x + 2,  2x + 4,  x + 4
```

Допустимые знаменатели: `x + 2`, `2x + 4`. Любой предложенный числитель
принимается.

### TTS

| UZ | RU | EN |
|---|---|---|
| Endi teskari masalani yeching. Minus ikki qiymatini taqiqlaydigan maxrajni tanlang. Bir nechta to‘g‘ri tuzilma mavjud. | Реши обратную задачу. Выбери знаменатель, который запрещает значение минус два. Правильных конструкций несколько. | Solve the reverse problem. Choose a denominator that excludes negative two. More than one construction is correct. |

---

## 18. Экран 14 — итоговый перенос

\[
C(p)=\frac{12-p}{2p+8}.
\]

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | YANGI MODEL | НОВАЯ МОДЕЛЬ | NEW MODEL |
| Заголовок | Yangi formulani mustaqil tekshiring | Самостоятельно проверь новую формулу | Check a new formula independently |
| Задание 1 | Taqiqlangan \(p\) qiymatini toping. | Найди запрещённое значение \(p\). | Find the excluded value of \(p\). |
| Задание 2 | \(p=12\) mumkinmi? | Допустимо ли \(p=12\)? | Is \(p=12\) permissible? |
| Задание 3 | Ikki natija orasidagi farqni tushuntiring. | Объясни различие между двумя результатами. | Explain the difference between the two results. |
| Верно | To‘g‘ri. \(2p+8=0\) dan \(p=-4\). \(p=12\) da surat nolga, maxraj 32 ga teng, shuning uchun formula aniqlangan va qiymati 0. | Верно. Из \(2p+8=0\) получаем \(p=-4\). При \(p=12\) числитель равен 0, знаменатель — 32, поэтому формула определена и равна 0. | Correct. Solving \(2p+8=0\) gives \(p=-4\). When \(p=12\), the numerator is 0 and the denominator is 32, so the formula is defined and its value is 0. |
| Подсказка 1 | Avval \(2p+8=0\) ni yeching. | Сначала реши \(2p+8=0\). | Solve \(2p+8=0\) first. |
| Подсказка 2 | \(p=12\) da surat va maxrajni alohida hisoblang. | При \(p=12\) вычисли числитель и знаменатель отдельно. | When \(p=12\), calculate the numerator and denominator separately. |
| Подсказка 3 | Faqat nolli maxraj qiymatni taqiqlaydi. | Значение запрещает только нулевой знаменатель. | Only a zero denominator makes a value excluded. |

Ответ:

```text
excludedP = -4
p12Allowed = true
reason = zero-numerator-allowed
```

Оценивание: `3` смысловых пункта.

### TTS

| UZ | RU | EN |
|---|---|---|
| Yangi formulani tayanchsiz tekshiring. Maxrajni nolga tenglashtirib taqiqlangan qiymatni toping. Keyin pe o‘n ikkiga teng bo‘lganda surat va maxrajni alohida tekshiring. | Проверь новую формулу без пошаговой опоры. Приравняй знаменатель к нулю, затем отдельно проверь числитель и знаменатель при пэ, равном двенадцати. | Check the new formula without step-by-step support. Set the denominator equal to zero, then check the numerator and denominator separately when p equals twelve. |

---

## 19. Экран 15 — итог

\[
\frac{A(x)}{B(x)}
\quad\text{имеет смысл, если}\quad
B(x)\ne0.
\]

### Заголовок и фразы

| Элемент | UZ | RU | EN |
|---|---|---|---|
| Метка | XULOSA | ВЫВОД | CONCLUSION |
| Заголовок | Tadqiqot xulosasini yakunlang | Заверши вывод исследования | Complete the investigation conclusion |
| Фраза 1 | Taqiqlangan qiymatlarni topish uchun men ___ ni tekshiraman. | Чтобы найти запрещённые значения, я проверяю ___. | To find excluded values, I check the ___. |
| Ответ 1 | maxraj | знаменатель | denominator |
| Фраза 2 | Agar maxraj nolga teng bo‘lmasa, nolli surat ___. | Если знаменатель не равен нулю, нулевой числитель ___. | If the denominator is not zero, a zero numerator is ___. |
| Ответ 2 | mumkin | допустим | allowed |
| Фраза 3 | Mening dastlabki gipotezam ___, chunki ___. | Моя начальная гипотеза ___, потому что ___. | My initial hypothesis was ___ because ___. |
| Кнопка | Xulosani tasdiqlash | Подтвердить вывод | Confirm conclusion |

В третьей фразе принимаются:

- `confirmed` + математическая причина;
- `revised` + математическая причина.

### Финальная обратная связь

| UZ | RU | EN |
|---|---|---|
| Tadqiqot yakunlandi. Ratsional kasrning qiymati mavjud bo‘lishi uchun maxraj nolga teng bo‘lmasligi kerak. | Исследование завершено. Чтобы рациональная дробь имела значение, её знаменатель не должен быть равен нулю. | Investigation complete. For a rational expression to have a value, its denominator must not equal zero. |

### Мост к уроку 2

| UZ | RU | EN |
|---|---|---|
| Agar surat va maxrajni bir xil usulda o‘zgartirsak, kasrning qiymati har doim saqlanadimi? Dastlabki cheklovlar bilan nima sodir bo‘ladi? | Если изменить числитель и знаменатель одинаковым способом, всегда ли значение дроби сохранится? Что произойдёт с исходными ограничениями? | If the numerator and denominator are changed in the same way, will the value of the fraction always stay the same? What happens to the original restrictions? |

### TTS

| UZ | RU | EN |
|---|---|---|
| Asosiy xulosani yakunlang. Taqiqlangan qiymat maxrajni nolga aylantiradi. Surat nolga teng bo‘lishi mumkin, agar maxraj nol bo‘lmasa. | Заверши главный вывод. Запрещённое значение обращает знаменатель в ноль. Числитель может быть равен нулю, если знаменатель не равен нулю. | Complete the main conclusion. An excluded value makes the denominator zero. The numerator may equal zero as long as the denominator is not zero. |

---

## 20. Банк практики — 10 заданий

### Задание 1. Распознавание

Формулы:

\[
3x-5,\qquad
\frac{x+1}{x-4},\qquad
\frac79,\qquad
x^2+2.
\]

| UZ | RU | EN |
|---|---|---|
| Qaysi ifodaning maxrajida o‘zgaruvchi bor? | В каком выражении переменная находится в знаменателе? | Which expression has a variable in its denominator? |

Ответ: `(x + 1)/(x - 4)`.

Механика: single choice. Тег: `concept`.

### Задание 2. Структура

\[
\frac{2a-1}{a+6}
\]

| UZ | RU | EN |
|---|---|---|
| Surat va maxrajni ko‘rsating. | Укажи числитель и знаменатель. | Identify the numerator and denominator. |

Ответ: numerator `2a - 1`, denominator `a + 6`.

Механика: tap regions. Тег: `structure`.

### Задание 3. Значение выражения

\[
\frac{x+4}{x-1},\qquad x=3.
\]

| UZ | RU | EN |
|---|---|---|
| Ifodaning qiymatini toping. | Найди значение выражения. | Find the value of the expression. |

Ответ: `7/2`.

Механика: fraction input. Тег: `procedure`.

### Задание 4. Запрещённое значение

\[
\frac{5}{3x+9}
\]

| UZ | RU | EN |
|---|---|---|
| Taqiqlangan \(x\) qiymatini toping. | Найди запрещённое значение \(x\). | Find the excluded value of \(x\). |

Ответ: `-3`.

Механика: numeric input. Тег: `condition`.

### Задание 5. Соответствие

\[
\frac{x-1}{x+2},\qquad
\frac{x+2}{x-1},\qquad
4x+1.
\]

| UZ | RU | EN |
|---|---|---|
| Har bir ifodani uning bo‘lish bilan bog‘liq cheklovi bilan moslang. | Сопоставь каждое выражение с ограничением, связанным с делением. | Match each expression to its restriction caused by division. |

Ответы:

- `(x - 1)/(x + 2)` → `x ≠ -2`;
- `(x + 2)/(x - 1)` → `x ≠ 1`;
- `4x + 1` → no division restriction.

Механика: matching. Тег: `representation`.

### Задание 6. Стратегия

\[
\frac{2x-5}{7x+14}
\]

| UZ | RU | EN |
|---|---|---|
| Taqiqlangan qiymatni to‘liq topish uchun qaysi amalni bajarish kerak? | Какое действие полностью определит запрещённое значение? | Which action will determine the excluded value completely? |

Ответ: solve `7x + 14 = 0`.

Механика: strategy choice. Тег: `strategy`.

### Задание 7. Конструирование

| UZ | RU | EN |
|---|---|---|
| \(x=4\) da aniqlanmagan ratsional kasr tuzing. | Построй рациональную дробь, не определённую при \(x=4\). | Build a rational expression that is undefined when \(x=4\). |

Принимаемые знаменатели: `x - 4`, `2x - 8`.

Механика: constructor. Тег: `reverse`.

### Задание 8. Граничный случай

\[
U(x)=\frac{x+5}{x-2},
\qquad
V(x)=\frac{x-2}{x+5},
\qquad x=-5.
\]

| UZ | RU | EN |
|---|---|---|
| Qaysi ifoda aniqlangan va nolga teng? Qaysi ifoda aniqlanmagan? | Какое выражение определено и равно нулю? Какое не определено? | Which expression is defined and equals zero? Which expression is undefined? |

Ответ: `U(-5) = 0`, `V(-5)` undefined.

Механика: contrast sort. Тег: `boundary`.

### Задание 9. Анализ ошибки

\[
\frac{y+1}{y-6}
\]

Ошибочное заключение: `y = -1` запрещено, потому что числитель равен нулю.

| UZ | RU | EN |
|---|---|---|
| Xatoni tuzating va haqiqiy taqiqlangan qiymatni toping. | Исправь ошибку и найди настоящее запрещённое значение. | Correct the error and find the actual excluded value. |

Ответ: `y = 6` excluded; `y = -1` allowed and gives zero.

Механика: error marking. Тег: `misconception`.

### Задание 10. Перенос

\[
M(t)=\frac{3t-12}{5t+10}.
\]

| UZ | RU | EN |
|---|---|---|
| Taqiqlangan \(t\) qiymatini toping. Keyin \(t=4\) mumkinligini tekshiring va sababini tushuntiring. | Найди запрещённое значение \(t\). Затем проверь допустимость \(t=4\) и объясни причину. | Find the excluded value of \(t\). Then check whether \(t=4\) is permissible and explain why. |

Ответ:

- excluded: `t = -2`;
- `t = 4` allowed;
- value at `t = 4` is `0`.

Механика: mixed input + reason builder. Тег: `transfer`.

---

## 21. Общая обратная связь практики

| Состояние | UZ | RU | EN |
|---|---|---|---|
| Верный ответ | To‘g‘ri. Javob maxrajning nolga teng bo‘lmaslik shartiga mos. | Верно. Ответ учитывает условие ненулевого знаменателя. | Correct. The answer respects the condition that the denominator is not zero. |
| Проверить знаменатель | Avval maxrajni tekshiring. | Сначала проверь знаменатель. | Check the denominator first. |
| Перепутан знак | Nolga olib keladigan qiymatni toping, so‘ng uni mumkin qiymatlardan chiqaring. | Найди значение, которое даёт ноль, а затем исключи его. | Find the value that gives zero, then exclude it. |
| Перепутан числитель | Nolli surat kasrni aniqlanmagan qilmaydi. Cheklovni maxraj yaratadi. | Нулевой числитель не делает дробь неопределённой. Ограничение создаёт знаменатель. | A zero numerator does not make a fraction undefined. The denominator creates the restriction. |
| После третьей ошибки | Bir qadamni birga bajaramiz: avval maxrajni nolga tenglashtiring. | Выполним один шаг вместе: сначала приравняй знаменатель к нулю. | Let us complete one step together: first set the denominator equal to zero. |

---

## 22. Английская математическая озвучка

Для EN используются устойчивые формы:

| Символ/запись | Произношение |
|---|---|
| \(K(x)\) | K of x |
| \(\frac{A}{B}\) | A over B / the fraction with A in the numerator and B in the denominator |
| \(x\ne3\) | x is not equal to three |
| \(x=-4\) | x equals negative four |
| \(x^2\) | x squared |
| undefined | undefined |
| numerator | numerator |
| denominator | denominator |
| excluded value | excluded value |
| permissible value | permissible value |

На первом упоминании сложной дроби используется полная конструкция с
`numerator` и `denominator`. В коротких повторениях допустимо `A over B`.

---

## 23. Контроль языкового паритета

Перед реализацией и после неё автоматически проверяется:

- [ ] каждый локализованный объект содержит `uz`, `ru`, `en`;
- [ ] нет пустых строк;
- [ ] на всех языках одинаковые формулы и значения;
- [ ] option ID и answer ID не переводятся;
- [ ] на всех языках совпадает число экранов;
- [ ] на всех языках совпадает число заданий и попыток;
- [ ] подсказка одного уровня раскрывает одинаковый объём;
- [ ] EN не использует RU fallback;
- [ ] TTS locale соответствует выбранному языку;
- [ ] переключение языка сохраняет состояние;
- [ ] визуальная высота EN-текста проверена на 390 px;
- [ ] UZ, RU и EN проверены языковыми редакторами;
- [ ] математические термины совпадают с утверждённым глоссарием;
- [ ] практика содержит ровно 10 заданий на каждом языке.
