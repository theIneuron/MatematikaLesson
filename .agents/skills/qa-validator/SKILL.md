---
name: qa-validator
description: Validates a complete .jsx lesson file against audio, locale, content, screen, design, and LMS contracts, including Grade 4 UZ/RU/EN completeness and English audio parity. Triggers when the methodist says "qa", "проверь", "validate", or after jsx-builder finishes. Returns a structured report with errors, warnings, and info; uses deterministic checks plus semantic review.
---

# qa-validator

Проверяет собранный .jsx файл на нарушения правил knowledge base. **Четвёртый этап** pipeline. После QA методист либо принимает урок, либо возвращает на доработку с конкретными нарушениями к исправлению.

**Главный принцип:** qa-validator — **последняя линия защиты** перед публикацией. Если он пропустит ошибку — её увидит ребёнок. Поэтому проверки должны быть систематические, не «на глаз».

> ПРИМЕЧАНИЕ ПРИ ВЫГРУЗКЕ ИЗ NOTION: grep/regex-команды в разделах 2.x и 2.5 были искажены при экспорте Notion в markdown (экранирование спецсимволов, авто-ссылки). Ниже они восстановлены по смыслу комментариев. Перед сохранением как рабочий SKILL.md сверь точные regex с локальной версией в Codex Settings → Skills — она источник истины для самих паттернов.

---

## АКТИВНЫЙ КУРС

Активный курс этого Project — математика (см. system_prompt раздел 1). При чтении shared-документов из Platform Standards (`screen_types`, `design_system`, `uz_locale`, `infrastructure_v1`) использую секции для math — не для english или code. Если соответствующая секция курса в shared-документе ещё не выделена — проверяю по общей части.

### Профиль Grade 4: UZ/RU/EN

Для любого файла `src/components/grade4/Dars*.jsx` дополнительно применять трёхъязычный контракт:

- допустимые значения `lang`: `uz`, `ru`, `en`; fallback для отсутствующего/невалидного значения — `uz`;
- каждый пользовательский localized node и `LESSON_META.lessonTitle` содержит непустые `uz`, `ru`, `en`;
- EN не содержит кириллицу и не получает RU/UZ через молчаливый fallback;
- standalone selector содержит ровно `uz`, `ru`, `en` в этом порядке;
- binary locale-conditional (`lang === 'uz' ? ... : ...`, `lang === 'ru' ? ... : ...`) для видимого/ARIA текста запрещён;
- theory сохраняет одинаковое число и порядок аудио-сегментов в трёх языках, а Web Speech использует `en-GB`;
- practice остаётся audio-free: не добавлять AudioEngine, `useAudio`, TTS или Bit;
- production TTS URL сохраняет только документированные параметры `text` и `g`; не добавлять `lang`.

До любой проверки Grade 4 выбрать один из двух взаимоисключающих профилей. Этот routing имеет приоритет над общими theory-правилами ниже:

- **theory** — `DarsNN.jsx`: проверять видимые экраны, meta/payload и существующую в этом файле audio-архитектуру. Каноническая `audio.intro/on_correct/on_wrong` и утверждённые Grade 4 migration-схемы (`audio` localized arrays, `feedbackAudio[index]`) равноправны, если у каждого слышимого события есть UZ/RU/EN, per-option feedback и segment parity.
- **practice** — `DarsNNPractice.jsx`: проверять `UI`, `TASKS`, `LESSON_META`, ровно 10 заданий, scoring/retry/finish и audio-free контракт. `CONTENT`, `TOTAL_SCREENS`, `SCREEN_META`, `LangContext`, `AudioEngine`, `useAudio`, `useIsMobile`, Bit и v15 theory chrome не требуются. `tx(value, lang)` допустим вместо `LangContext`.

---

## ПРИНЦИПЫ

**1. Систематика важнее интуиции.** Технические правила (sen-формы, апострофы, кавычки в JS, тире с разъяснением) проверяю через `bash_tool` (grep, regex). Не «просматриваю файл и пытаюсь заметить». Каждое правило — конкретная проверка с конкретным выводом.

**2. Три уровня строгости.** Каждое нарушение классифицируется:
- 🔴 ERROR — критичное. Сломает урок или прорастёт misconception. Урок не считается готовым, пока не исправлено.
- 🟡 WARNING — снижает качество. Урок может быть опубликован, но методист видит проблему и решает: править или принять.
- 🔵 INFO — наблюдение. Не нарушение, но методисту полезно знать (draft-термин, отступление от типового шаблона).

**3. Отчёт — для человека, не для машины.** Каждое нарушение — 2-3 строки: тип, экран, цитата, краткое объяснение, ссылка на раздел knowledge base. Не выдаю стектрейсы или сырой grep output.

**4. Эталон в whitelist для известных issues.** В `uz_locale.md` раздел 11 описаны три поля эталона с sen-формами (s5.title_part1, s5.title_part2_em, s14.main_3). При проверке **эталона** эти поля не считаются нарушениями. При проверке **любого другого файла** — считаются.

**5. Не правлю сам.** Я нахожу нарушения и сообщаю. Исправление — задача content-generator или jsx-builder (по решению методиста, в какой из них вернуться).

**6. Полнота важнее краткости.** Если в файле 30 нарушений — выдаю все 30. Не сокращаю до «5 самых важных». Методист сам решит приоритет.

---

## ПРОЦЕДУРА

### Шаг 1 — Чтение файла и базовая структурная проверка

Сначала определяю профиль по имени файла, затем через `bash_tool` или `view` читаю его:
```bash
wc -l /path/to/lesson.jsx
# theory
grep -nE "^const (CONTENT|TOTAL_SCREENS|LESSON_META|SCREEN_META)|^class AudioEngine|^export default function" /path/to/DarsNN.jsx
# Grade 4 practice
grep -nE "^const (UI|TASKS|LESSON_META)|^export default function" /path/to/DarsNNPractice.jsx
```

Обязательные блоки зависят от профиля:

**Theory:**
- `CONTENT` — объект со всеми экранами
- `TOTAL_SCREENS` — число
- `LESSON_META` — `{ lessonId, lessonTitle }` для payload
- `SCREEN_META` — массив `{ id, type, template, scored, scope }` для подсчёта payload
- файловая audio-инфраструктура и реально используемый engine/hook
- `export default function` — корневой компонент. Сигнатура должна быть `({ lang, onFinished })` — если другая, 🔴 ERROR.

**Grade 4 practice:**
- `UI`, `TASKS`, `LESSON_META`, `export default function`;
- `TASKS.length === 10`, каждая задача имеет явные answer/correct metadata;
- корневой component принимает `lang` и `onFinished`;
- audio/Bit инфраструктура отсутствует.

Останавливаюсь с CRITICAL ERROR, только если отсутствует обязательный блок **выбранного** профиля.

```bash
# 🔴 ERROR: корневой компонент не принимает { lang, onFinished }
grep -nE "^export default function [A-Z][A-Za-z0-9]*\(\{.*lang.*onFinished.*\}\)" file.jsx
# должно быть найдено ровно 1 — иначе ERROR
```

### Шаг 2 — Систематические проверки через bash_tool

Для каждой группы правил выполняю конкретный grep. Все результаты с номерами строк собираю.

#### 2.1. UZ-локализация (`uz_locale.md`)

```bash
# 🔴 ERROR: одинарные кавычки в строках с UZ-апострофом — сломает парсер
# (искать одинарно-кавыченные строки, содержащие to'g'ri / bo'l / qo'sh / o'q / o'z / ko'p / yo'q / so'r / qo'l / so'ng и т.п.)
# 🔴 ERROR: модификаторный апостроф вместо обычного
grep -nP "[\x{02BB}\x{02BC}\x{2019}]" file.jsx
# 🔴 ERROR: sen-формы в UZ (за исключением whitelist эталона)
# Императивы/условные без -ng/-ing: o'zgartirsang, bo'lsang, kelsang, topsang, qarasang,
#   ko'rsang, qilsang, bilsang, yechsang, kiritsang, bossang, chizsang
# 🔴 ERROR: -sang/-sangiz/-san/-ding окончания (sen-условные/прошедшие) в UZ-полях
# (отфильтровать ложные срабатывания: sizning, mening, sening, hisoblang и др.)
```

#### 2.2. Аудио-правила (`audio_rules.md`)

Раздел 2.2 применяется только к theory. Для Grade 4 practice вместо него проверить, что audio/Bit/TTS-токенов в файле нет.

```bash
# 🔴 ERROR: кавычки внутри audio-полей (« » " " ' ')
# 🟡 WARNING: длинное тире в audio с разъяснением
# 🔴 ERROR: математические символы в audio (% $ / × ÷ = + < > ° №)
# 🔴 ERROR: дробные литералы в audio (1/2, 3/4 и т.д.)
# 🔴 ERROR: устаревшие ключи audio_q, audio_fb_correct, audio_fb_wrong
#   Новая модель — audio.intro / audio.on_correct / audio.on_wrong (audio_rules раздел 8.4)
grep -nE "(audio_q|audio_fb_correct|audio_fb_wrong) ?:" file.jsx
# если найдено — ERROR: устаревший ключ, заменить на audio.intro/on_correct/on_wrong
# 🔴 ERROR: theory MC-экран без полной утверждённой audio-схемы
#   Canonical: audio: { intro, on_correct, on_wrong }.
#   Grade 4 migration exception: audio: { intro, on_correct } + per-option feedbackAudio,
#   где feedbackAudio.length === options.length и все элементы UZ/RU/EN + TTS-safe.
#   Это семантическая проверка — см. шаг 3.
```

#### 2.3. Контент-схема (`content_schema.md`)

```bash
# 🔴 ERROR: поля без трёхъязычной структуры
#   (поля title_*, body, opt*, audio* должны быть объектами с uz/ru/en, не строками)
#   Это сложная регулярка — проверяю через чтение Codex'ом
# 🔴 ERROR: массивы audio разной длины для uz, ru и en — семантическая проверка
# 🔴 ERROR: undefined / null / пустая строка в любом из uz/ru/en
grep -nE "(uz|ru|en):\s*(null|undefined|['\"]['\"])" file.jsx
# 🔴 ERROR (Grade 4): кириллица внутри EN-поля
# 🔴 ERROR (Grade 4): LESSON_META.lessonTitle без en
# 🔴 ERROR (Grade 4): localized helper вызван без EN-аргумента
```

#### 2.4. JSX-правила и визуальный язык v15 (`design_system.md`, `screen_types.md`, `platform_contract.md`)

Требования к theory Stage/`useIsMobile`/`.btn-white-accent`/`.stage-header` не применять к Grade 4 practice shell. Для practice вместо них проверить outer width, mobile overflow, `focus-visible`, touch targets не меньше 44 px и правое расположение CTA.

```bash
# 🔴 ERROR: 100vh вместо 100dvh
grep -nE "100vh\b" file.jsx
# 🔴 ERROR: max-width не 936px (v15)
grep -nE "max-width:\s*[0-9]+px" file.jsx | grep -v "936"
# 🟡 WARNING: inline-математика текстом, не через <Frac>
grep -nE ">[^<]*[0-9]+/[0-9]+[^<]*<" file.jsx
# 🔴 ERROR: проприетарные шрифты
grep -nE "(SF Pro|Anthropic Sans|Helvetica Neue|Apple)" file.jsx
# 🔴 ERROR: @import для шрифтов внутри <style>
#   Шрифты приходят от LMS — никаких @import в коде урока (platform_contract раздел 5)
grep -nE "@import\s+url\(['\"]https?://fonts\." file.jsx
# 🔴 ERROR: useIsMobile отсутствует в инфраструктуре
grep -c "function useIsMobile" file.jsx       # должно быть >=1
# 🔴 ERROR: внутренний переключатель языка в корневом production-компоненте
#   В production версии lang приходит prop'ом; standalone Grade 4 preview — явное исключение
#   и обязан перечислять ровно ['uz', 'ru', 'en'].
grep -nE "useState\(['\"](ru|uz|en)['\"]\)" file.jsx
# 🔴 ERROR: localStorage / sessionStorage / fetch внутри урока
grep -nE "(localStorage|sessionStorage|document\.cookie|\bfetch\s*\(|XMLHttpRequest)" file.jsx
# должно быть 0 — иначе ERROR: внешние API запрещены (platform_contract раздел 4)
# 🔴 ERROR: onFinished не вызывается
rg -n 'onFinished(\?\.)?[[:space:]]*\(' file.jsx  # должно быть >=1
# 🟡 WARNING: onFinished вызывается больше одного раза (семантическая проверка — см. шаг 3)
```

##### Визуальный язык v15 — отдельный набор проверок

```bash
# 🔴 ERROR (v15): рамки 1.5px ink на frame/option/btn/answer-input
#   В v15 рамки заменены на тени из shadowBase. (design_system §1.3, §4.1–4.8)
grep -nE "(\.frame|\.option|\.answer-input|\.btn)[^{]*\{[^}]*border:\s*1\.5px\s+solid" file.jsx
# должно быть 0
#   (polosa 4px слева в .frame-soft / .frame-success — исключение, design_system §1.3.2)
# 🔴 ERROR (v15): отсутствие shadowBase в палитре T
grep -c "shadowBase:\s*['\"]58, 53, 48" file.jsx     # должно быть >=1
# 🔴 ERROR (v15): отсутствие .btn-white-accent в стилях
grep -c "\.btn-white-accent" file.jsx                # должно быть >=1
# 🔴 ERROR (v15): отсутствие .stage-header
grep -c "\.stage-header" file.jsx                    # должно быть >=1
# 🔴 ERROR (v15): отсутствие reset margins для h1-h6/p/ul/ol внутри .lesson-root
grep -nE "\.lesson-root\s+(h1|h2|h3|h4|h5|h6|p|ul|ol)" file.jsx
# должно быть найдено хотя бы одно правило с margin: 0
# 🔴 ERROR (v15): glow отсутствует на .progress-bar (orange box-shadow)
grep -A3 "\.progress-bar\s*\{" file.jsx | grep -c "rgba(255,\s*79,\s*40"
# должно быть >=1
# 🟡 WARNING (v15): возможный устаревший паттерн .btn (Dark CTA) как главной кнопки
grep -nE "NavNext.*className=['\"]btn['\"]" file.jsx
# должно быть 0 — главная CTA в NavNext = .btn-white-accent
# 🔴 ERROR (v15): кнопка "Проверить" слева через alignSelf
grep -nE "btn_check.*alignSelf:\s*['\"]flex-start" file.jsx
# должно быть 0
# 🟡 WARNING (v15): экран с btn_check не оборачивает кнопку в flex-end container
#   Семантическая проверка — см. шаг 3.6.
```

#### 2.5. Целостность AudioEngine (`etalon_v14`, содержимое v15)

Этот раздел применяется только к theory. Для Grade 4 practice наличие любого AudioEngine/`useAudio`/TTS/Bit — 🔴 ERROR.

Эталон содержит ~124 строки класса `AudioEngine`, обвязку `getAudioEngine` + `useAudio` + `makeAudioSegments`. JSX-builder должен скопировать их строка-в-строку из `infrastructure_v1`. QA проверяет:

```bash
# 🔴 ERROR: AudioEngine отсутствует или поломан
grep -c "^class AudioEngine" file.jsx                     # должно быть 1
grep -c "^let audioEngineInstance" file.jsx               # должно быть 1
grep -c "^function useAudio" file.jsx                     # должно быть 1
grep -c "window.speechSynthesis" file.jsx                 # должно быть >=3 (init, speak, cancel)
grep -c "onvoiceschanged" file.jsx                        # должно быть 1
# 🔴 ERROR: AudioEngine без метода pushOneOff (для on_correct/on_wrong аудио)
grep -c "pushOneOff" file.jsx                             # должно быть >=2 (определение + вызов)
# 🔴 ERROR: useAudio не вызван в одном из Screen-компонентов
#   Для каждого Screen0..ScreenN проверить наличие useAudio( в первых ~30 строках компонента.
# 🔴 ERROR: useAudio с пустым массивом сегментов
grep -nE "useAudio\(\[\s*\]\)" file.jsx                   # должно быть 0
# 🔴 ERROR: useAudio передаёт undefined text — проверяется чтением Codex'ом
# 🔴 ERROR: useAudio не содержит segments-стабилизатор (v14 fix).
#   Без него inline-литералы [{...}] в Screen-компонентах создают новую ссылку
#   на каждом рендере → cancel-loop → звук молчит.
grep -c "segmentsRef" file.jsx                            # должно быть >=1
grep -c "stableSegments" file.jsx                         # должно быть >=1
grep -c "JSON.stringify(segments)" file.jsx               # должно быть 1
# Если хоть одна проверка вернула 0 → ERROR:
#   "useAudio не содержит segments-стабилизатор v14. Аудио будет сломано из-за
#    cancel-loop при ре-рендерах. Скопируй useAudio из infrastructure_v1 как есть."
```

**Семантическая проверка целостности AudioEngine.** Помимо grep, делаю diff с `infrastructure_v1` — класс `AudioEngine`, `useAudio`, `makeAudioSegments` должны совпадать строка-в-строку. Если есть отличия, даже на одну строку — 🔴 ERROR: «Audio engine модифицирован от infrastructure_v1. JSX-builder должен копировать его как есть».

Это покрывает класс ошибок «тихий баг озвучки» — когда AudioEngine присутствует, но из-за минорной правки (например, лишний пробел в имени метода или пропущенный `return`) — не работает.

### Шаг 3 — Семантические проверки чтением

Технические проверки покрывают форму. Содержание проверяю через чтение Codex'ом ключевых блоков CONTENT.

#### 3.0. Grade 4 i18n и аудио

Для Grade 4 запускать общий AST-аудит всех 51 компонентов, а затем проверять конкретный файл:

```bash
node scripts/grade4-trilingual-audit.mjs
node scripts/grade4-i18n-audit.mjs Dars22
node scripts/grade4-i18n-audit.mjs Dars15Practice
npm run test:grade4:browser:trilingual
```

Результаты отчёта разделять: target-file QA и global 51-file publication gate. Ошибка в чужом файле блокирует публикацию курса, но не выдаётся как дефект проверяемого target.

- обойти object literals и вызовы локализационных helper-ов с учётом их порядка аргументов (`B(ru, uz, en)`, `b(uz, ru, en)`, `bi(uz, ru, en)`); у каждого узла должны быть три непустых значения;
- убедиться, что ни один видимый/ARIA branch не отправляет `en` в RU/UZ fallback;
- проверить `LESSON_META.lessonTitle.en` и фактический `onFinished.lessonTitle`;
- для theory сравнить число EN сегментов с UZ и RU на каждом экране; проверить locale map `en -> en-GB` и отмену старой очереди при смене языка;
- для practice подтвердить отсутствие audio/Bit инфраструктуры;
- проверить selector и host/standalone режимы; invalid `lang` обязан нормализоваться в `uz`.

#### 3.1. Misconceptions в test-экранах

Для каждого test-choice / case-step / case-conclusion экрана проверяю:
- Есть ли `correct_text`?
- Для каждого `optN` (N ≠ correct_idx) — есть ли соответствующий `wrong_N`?
- Если `wrong_default` используется при наличии ≥3 misconceptions — это 🟡 WARNING: общий разбор вместо конкретных.
- Каждый `wrong_N` содержит хотя бы 2 предложения (опровержение + пояснение)? Если меньше — 🟡 WARNING.

#### 3.2. Поведение возврата (по `screen_types.md` §9)

Для каждого Screen-компонента смотрю useState'ы:

- **Hook** → `useState(null)`. **Полный сброс при возврате — без чтения `storedAnswer`.** Hook — это провокация, она теряет смысл, если ответ уже виден. Если в Screen hook читает `storedAnswer?.picked` — 🔴 ERROR: устаревшее поведение из ранних версий эталона, в v15 hook полностью сбрасывается.
- **Exploration** → начальное значение виджета (не из storedAnswer), `checked: false`.
- **Test (choice/input)** → `useState(storedAnswer?.studentAnswerIndex ?? null)` или `storedAnswer?.studentAnswer ?? ''` + `revealed: storedAnswer !== undefined`. Полностью восстанавливается, включая feedback.
- **Case (step/conclusion)** → как Test.

Если поведение не соответствует типу — 🔴 ERROR со ссылкой на `screen_types.md` §9.

#### 3.3. Структура урока

- Первый экран — hook? Если нет — 🔴 ERROR.
- Последний экран — summary? Если нет — 🔴 ERROR.
- Test-экранов минимум 3-4? Если меньше — 🟡 WARNING: возможно, недостаточно проверки.
- Соотношение rule:test ≥ 1:2 (правила должны проверяться)? Если меньше — 🟡 WARNING.

#### 3.4. Длительность

- Всего 12-18 экранов? Меньше — 🟡 WARNING «урок слишком короткий». Больше — 🟡 WARNING «урок слишком длинный, рассмотреть разбиение».
- Аудио-сегменты в `audio`-массивах: длина каждого сегмента 10-50 слов? Подсчитываю через split. Сегменты >50 слов — 🟡 WARNING.

#### 3.5. Единообразие

- Дроби в речи: проверяю, не смешаны ли «треть» и «одна третья» в разных audio-сегментах одного урока. Если смешано — 🟡 WARNING.
- Имена персонажей: в кейс-блоке имя постоянное? Если меняется — 🟡 WARNING.
- Терминология: `umumiy maxraj` vs `umumiy bo'luvchi` — если смешано, 🟡 WARNING.

#### 3.6. Промежуточная CTA «Проверить» — положение справа (v15)

Для каждого экрана типа `exploration / slider` и `test / input` (есть локальный шаг проверки внутри одного экрана) — проверяю JSX-разметку кнопки `btn_check`:

- Кнопка обёрнута в `<div style={{ display: 'flex', justifyContent: 'flex-end' }}>` или эквивалент? Если нет — 🔴 ERROR: кнопка должна быть справа в новой строке (см. `design_system.md` §10).
- Использует класс `.btn-white-accent`? Если использует `.btn` (Dark CTA) или вообще без класса — 🔴 ERROR: главная промежуточная CTA в v15 — `btn-white-accent`.
- `alignSelf: 'flex-start'` присутствует? Если да — 🔴 ERROR: устаревший паттерн v14, должна быть справа.

#### 3.7. Имена scope в SCREEN_META (по `screen_types.md` §1.5)

Каждый объект в массиве `SCREEN_META` должен иметь `scope` строго из допустимого набора:

| type | scope |
|---|---|
| `hook` | `'hook'` |
| `exploration` | `null` |
| `rule` | `null` |
| `test` (промежуточный) | `'module-mikro'` |
| `test` (финальный, обычно последний test перед summary) | `'final'` |
| `case` (setup) | `null` |
| `case` (step / conclusion) | `'module-mikro'` |
| `summary` | `null` |

Любое другое значение scope (`'practice'`, `'lesson'`, `'check'`, etc.) — 🔴 ERROR. Это устаревшие или придуманные имена, нарушающие контракт payload-сборки.

#### 3.8. Контракт LMS — onFinished payload (`platform_contract.md`)

Нижеследующий полный theory-payload применяется к theory. Для Grade 4 practice сохранять существующую форму payload файла (`lessonId`, выбранный `lessonTitle`, `totalQuestions`, `correctAnswers`, `scorePercent` и его уже существующие дополнения), completion guard и вызов exactly once после десятой решённой задачи. Не требовать от practice новых theory-полей.

Проверяю содержание `finishLesson` функции в корневом компоненте:
- Вызывается ровно один раз — на финальном экране. Не на mount, не несколько раз. 🔴 ERROR иначе.
- Payload содержит все обязательные поля: `lessonId`, `lessonTitle`, `durationSec`, `totalQuestions`, `correctAnswers`, `scorePercent`, `finalScore`, `finalTotal`, `passed`, `answers`. Отсутствие любого — 🔴 ERROR.
- `lessonId` в формате kebab-case + `-vN`: regex `^[a-z]+-\d+-\d+-v\d+$`. Иначе 🟡 WARNING.
- `SCREEN_META` содержит хотя бы один экран со `scope: 'final'`. Без этого `passed` рассчитается по fallback'у, что нежелательно. 🟡 WARNING.
- `SCREEN_META.length === CONTENT.length === TOTAL_SCREENS` — все три числа должны совпадать. Несовпадение — 🔴 ERROR.
- В theory семантически проверить инициализацию timer через `Date.now()` и его реальное использование в `durationSec`; не требовать конкретное имя `startTimeRef`.

#### 3.9. Контракт компонента (`platform_contract.md`)

- Корневой компонент принимает `{ lang, onFinished }` — проверено в шаге 1.
- В theory `LangContext.Provider` инициализируется из нормализованного `props.lang`, не из несвязанного state. В Grade 4 practice допустим `tx(value, normalizedLang)` без `LangContext`.

### Шаг 4 — Формирование отчёта

Собираю все находки. Группирую по типу (Error → Warning → Info). Каждое нарушение в формате:

```
🔴 ERROR · Screen 6 (s5) · UZ siz-форма
	Поле: title_part1
	Найдено: "Maxrajni o'zgartirsang —"
	Правило: uz_locale.md раздел 4 — sen-формы запрещены везде, кроме whitelist эталона.
	Исправление: "Maxraj o'zgarsa —" (безличная) или "Maxrajni o'zgartirasiz —" (siz).
```

Информация для методиста (не нарушения):
```
🔵 INFO · UZ-терминология
	Узбекский термин "kasr qismi" использован 3 раза — статус draft, требует валидации
	узбекским методистом математики.
```

Если нарушений нет вообще — выдаю короткое:
```
✅ Урок прошёл QA-проверку.
- Структура: hook + 2 exploration + 2 rule + 5 test + 3 case + 1 final test + summary
- Экранов: 15
- UZ: все правила соблюдены (4 поля помечены как draft-терминология)
- Аудио: 17 сегментов, средняя длина 22 слова
- Визуальный язык v15: тени, .btn-white-accent, .stage-header, glow — все на месте
- Готов к ревью методистом и публикации.
```

### Шаг 5 — Приоритизация для исправления

Если есть ERROR — урок не готов, явно говорю об этом:
> «Урок не готов к публикации: найдено [N] критичных нарушений. Рекомендую вернуться к [content-generator / jsx-builder] для исправления. Хочешь, чтобы я запустил исправление сам, или сначала проверишь список?»

Если только WARNING — урок формально проходит, но я выделяю самые важные:
> «Урок проходит QA с [N] замечаниями. Из них [M] стоит исправить до публикации: [список]. Остальные на твоё усмотрение.»

Если только INFO — урок готов, ничего исправлять не требуется.

---

## ПОЛНЫЙ СПИСОК ПРОВЕРЯЕМЫХ ПРАВИЛ

Сводно, со ссылками на knowledge base:

### Errors (критичные)

1. Одинарные кавычки в JS-строках с UZ-апострофом — `uz_locale.md` 2.4.
2. Модификаторный апостроф вместо обычного — `uz_locale.md` 2.2.
3. Sen-формы / -sang окончания в UZ-полях — `uz_locale.md` 4. (whitelist для эталона: s5.title_part1, s5.title_part2_em, s14.main_3).
4. Кавычки в audio-полях — `audio_rules.md` 2.1.
5. Математические символы в audio (%, $, /, ×, =, +, <, >) — `audio_rules.md` 2.3.
6. Дробные литералы в audio (1/2 вместо «одна вторая») — `audio_rules.md` 3.
7. Трёхъязычная структура нарушена (пустой / null / undefined в uz, ru или en) — `content_schema.md` 2 и профиль Grade 4.
8. Массивы audio разной длины для uz, ru и en — `content_schema.md` 3.2 и профиль Grade 4.
9. Hook с сохранением picked (читает `storedAnswer?.picked`) — `screen_types.md` §9. Hook должен использовать `useState(null)` без чтения storedAnswer; провокация теряет смысл, если ответ уже виден.
10. Test без сохранения состояния возврата — `screen_types.md` §9.
11. Отсутствие correct_text в test-экране — `content_schema.md` 4.5.
12. `100vh` вместо `100dvh` — `design_system.md` §5.1.
13. Max-width не 936px — `design_system.md` §5.2.
14. Проприетарные шрифты — `design_system.md` §2.
15. Первый экран не hook / последний не summary — `screen_types.md` §11.
16. AudioEngine отсутствует или модифицирован от `infrastructure_v1` — раздел 2.5 (diff).
17. useAudio не вызван в одном из Screen-компонентов — раздел 2.5.
18. useAudio с пустым массивом сегментов или undefined text — раздел 2.5.
19. useAudio не содержит segments-стабилизатор (v14 fix) — раздел 2.5. Без него cancel-loop, звук молчит.
20. Устаревшие ключи audio_q / audio_fb_correct / audio_fb_wrong — заменены на `audio.intro` / `audio.on_correct` / `audio.on_wrong` (см. `audio_rules.md` 8.4).
21. Theory MC-экран без полной допустимой схемы: canonical `audio.intro/on_correct/on_wrong`; либо только для Grade 4 migration `audio.intro/on_correct` + `feedbackAudio[index]` с parity по options и UZ/RU/EN TTS-safe текстом — `audio_rules.md` 8.4 и Grade 4 profile.
22. AudioEngine без метода `pushOneOff` — раздел 2.5.
23. `@import` для шрифтов внутри `<style>` — шрифты приходят от LMS (`platform_contract.md` 5).
24. Отсутствие `useIsMobile` в инфраструктуре — `design_system.md` §5.0.
25. Внутренний production-переключатель языка (`useState('ru')` в корневом компоненте) — `platform_contract.md` 1. Standalone Grade 4 preview проверяется отдельным профилем.
26. Корневой компонент не принимает `{ lang, onFinished }` — `platform_contract.md` 1.
27. localStorage / sessionStorage / fetch / XMLHttpRequest внутри урока — `platform_contract.md` 4.
28. onFinished не вызывается или вызывается более одного раза — `platform_contract.md` 2.
29. LESSON_META или SCREEN_META отсутствуют — `content_schema.md` 0, `platform_contract.md` 2.
30. SCREEN_META.length ≠ CONTENT.length ≠ TOTAL_SCREENS — рассинхрон.
31. Поля payload неполные (отсутствует lessonId / durationSec / answers и т.д.) — `platform_contract.md` 2.
32. startTimeRef отсутствует в корневом компоненте — `platform_contract.md` 2.
33. LangContext.Provider не использует props.lang — `content_schema.md` 0.2.
G1. (Grade 4) `LESSON_META.lessonTitle.en` отсутствует или пуст — payload теряет название урока.
G2. (Grade 4) EN-поле содержит кириллицу или молчаливо падает в RU/UZ.
G3. (Grade 4) Standalone selector не равен `UZ/RU/EN` или invalid lang не падает в UZ.
G4. (Grade 4 theory) EN audio отсутствует, нарушена segment parity или Web Speech locale не `en-GB`.
G5. (Grade 4 practice) добавлена audio/Bit инфраструктура вопреки audio-free контракту.
G6. (Grade 4) production TTS URL получил недокументированный параметр помимо `text` и `g`.
G7. (Grade 4) пользовательский/ARIA текст использует бинарный locale-conditional и отправляет EN в чужую ветку.

#### Errors v15 — визуальный язык

34. (v15) Рамки `border: 1.5px solid` на `.frame` / `.option` / `.answer-input` / `.btn` — в v15 рамки заменены на тени из `shadowBase`. Исключение: polosa 4px слева в `.frame-soft` / `.frame-success`. См. `design_system.md` §1.3, §4.1–4.8.
35. (v15) Отсутствие `shadowBase: '58, 53, 48'` в палитре `T` — `design_system.md` §1.
36. (v15) Отсутствие `.btn-white-accent` в стилях — главная CTA нового языка формы. `design_system.md` §4.2.
37. (v15) Отсутствие `.stage-header` — sticky-header (progress + chrome) должен быть вынесен из `.stage-content`. `design_system.md` §4.6, §5.1.
38. (v15) Отсутствие reset margins для `h1-h6` / `p` / `ul` / `ol` внутри `.lesson-root` — без них дефолтные браузерные margins сбивают layout. `design_system.md` §5.1.
39. (v15) Отсутствие orange glow на `.progress-bar` — `design_system.md` §6.3.
40. (v15) Промежуточная CTA «Проверить» слева через `alignSelf: 'flex-start'` — должна быть справа через `<div style={{ display: 'flex', justifyContent: 'flex-end' }}>` + класс `.btn-white-accent`. `design_system.md` §10.
41. (v15) Промежуточная CTA «Проверить» не использует класс `.btn-white-accent` — `design_system.md` §10.
42. (v15) `SCREEN_META` содержит `scope` вне допустимого набора `{'hook', 'module-mikro', 'final', null}` — `screen_types.md` §1.5. Старые имена (`'practice'`, `'lesson'`, etc.) — нарушение.

### Warnings (качество)

1. Длинное тире с разъяснением в audio — `audio_rules.md` 2.2.
2. Wrong_default при наличии 3+ misconceptions — `screen_types.md` §5.
3. Wrong_N короче 2 предложений — `methodology.md` 1.3.
4. Inline-математика текстом, не через `<Frac>` — `content_schema.md` 9, `design_system.md` 4.4.
5. Аудио-сегмент длиннее 50 слов — `audio_rules.md` 5.2.
6. Урок короче 12 / длиннее 18 экранов — `screen_types.md` §1.
7. Test-экранов меньше 3 — общее правило.
8. Дроби в речи смешаны (треть vs одна третья в одном уроке) — `audio_rules.md` 3.1.
9. Имя персонажа меняется в кейс-блоке — `uz_locale.md` 5.5.
10. Смешанная терминология (umumiy maxraj vs umumiy bo'luvchi) — `uz_locale.md` 6.1.
11. Длинная подчинительная связь в audio — `audio_rules.md` 7.2.
12. (v15) Главная CTA `NavNext` использует `.btn` вместо `.btn-white-accent` — устаревшая иерархия v14, в v15 главная CTA = `.btn-white-accent`. `design_system.md` §4.2.

### Info (наблюдения)

1. Отступление от типового шаблона — методическая заметка.
2. Высокая когнитивная нагрузка на экране (≥4 идеи).
3. Новый тип виджета, не входящий в эталон.

**Что НЕ помечается как INFO:**
- ~~UZ-термин в статусе draft~~ — убрано. Если урок дошёл до qa-validator, методист уже прошёл цикл review и проверил UZ-поля. Помечать draft на этом этапе бессмысленно. Валидация узбекским методистом математики — это внешний процесс перед production-публикацией, не QA в pipeline.

---

## НЕТИПОВЫЕ СЛУЧАИ

### Файл — это эталон (страница `etalon_v14`, содержимое v15)

Если методист просит «проверь эталон» (например, для самодиагностики системы):

Применяю whitelist из `uz_locale.md` раздел 11: три поля с sen-формами не считаются нарушениями. Все остальные правила — применяются как обычно.

В отчёте явно отмечаю:
> «Whitelist эталона применён. Sen-формы в s5.title_part1, s5.title_part2_em, s14.main_3 не считаются нарушениями (см. `uz_locale.md` раздел 11).»

### Грубый JSX (синтаксические ошибки)

Если grep / view показывает, что файл не валидируется (несбалансированные скобки, ошибки парсинга):

Возвращаю CRITICAL ERROR: «Файл не валидный JSX. Возможно, jsx-builder выдал поломанный результат. Рекомендую перегенерировать .jsx с нуля или показать мне точный текст ошибки».

Не пытаюсь дальше валидировать содержание — нет смысла.

### Файл слишком большой для регулярных проверок

Если файл >5000 строк (что нетипично для одного урока, но возможно для production-сборки нескольких) — оптимизирую: использую `bash_tool` с grep + line numbers, а не загружаю файл целиком в context.

### Методист не согласен с warning

Например, qa-validator выдал warning «wrong_N короче 2 предложений», методист отвечает «это нормально, это простой экран».

Что делаю: не настаиваю. Warning — это сигнал, методист принимает решение. Записываю в финальный отчёт: «Warning принят методистом без правки».

### Появился ERROR, который методист считает ложным срабатыванием

Например, скилл нашёл «sen-форму» в слове, которое на самом деле имя собственное или заимствование.

Что делаю: обсуждаю с методистом. Если методист подтверждает, что это ложное срабатывание — обновляю правило (например, добавить слово в исключение). Но не «ради удобства», а только когда регекс действительно ловит то, что не должен.

---

## ОПИРАЮСЬ НА (knowledge base)

**Platform Standards** (общий слой):
- `audio_rules` — раздел 9 (чек-лист), раздел 8 (сегментный протокол и audio.intro/on_correct/on_wrong).
- `uz_locale` — раздел 9 (чек-лист), раздел 11 (known issues эталона).
- `content_schema` — раздел 0 (контракт компонента, payload), раздел 11 (чек-лист), раздел 9 (i18n-пробелы), раздел 7 (skeleton поля).
- `screen_types` — §1.5 (template/scored/scope, допустимые значения), §3 (exploration с кнопкой «Проверить» справа), §5 (test-input с кнопкой «Проверить» справа), §9 (поведение возврата), §11 (что запрещено). Секция math.
- `design_system` — §1 (палитра с `shadowBase`), §1.3 (система теней), §2.1 (шрифты от LMS), §3.5 (display-размеры × 0.85), §4.1–4.8 (компоненты v15: frame, button с `.btn-white-accent`, option, Stage с stage-header, input, slider), §5.0 (useIsMobile + padding 100/12), §5.1 (stage-header, reset margins), §5.2 (max-width 936), §6.3 (progress с glow), §7 (что не трогаем), §8 (SVG sizing), §10 (промежуточная CTA «Проверить» справа). Секция math.
- `platform_contract` — все разделы. Без него qa не может проверить контракт LMS.
- `infrastructure_v1` (ID `36d560538746817d9a0bc2e4d06d9ad2`) — главный источник для diff с `AudioEngine`, `useAudio`, `makeAudioSegments`. JSX-builder копирует строка-в-строку, QA проверяет diff'ом.

**Math** (course):
- `methodology` — раздел 1.3 (misconceptions обязательны).
- `etalon_v14` (ID `36a56053874681668917f461b82c6e62`, содержимое v15) — структурный референс. НЕ для корневого компонента — у эталона может остаться preview-обвязка `useState('ru')` + lang-switch, это нормально для прокликивания методистом.

---

## ЧТО Я НЕ ДЕЛАЮ

- Не правлю файл сам. Только нахожу и сообщаю.
- Не игнорирую нарушения «ради скорости». Полный отчёт, даже если 30+ пунктов.
- Не классифицирую warning как error и наоборот. Уровни строгости фиксированы.
- Не пропускаю whitelist эталона. Три известных поля sen-формы помечены явно.
- Не выдаю отчёт в формате стектрейса. Каждое нарушение — человекочитаемо.
- Не запускаю исправление сам после QA. Жду решения методиста.
- Не «подсказываю», какой именно правкой исправить — это задача content-generator / jsx-builder.
- Не претендую на 100% автоматическое покрытие. Если методист видит проблему, которую я пропустил — добавляю правило (с его согласия) в knowledge base.
