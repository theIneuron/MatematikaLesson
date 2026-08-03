---
name: jsx-builder
description: Assembles a complete .jsx React file from a CONTENT object and a skeleton. Triggers when the methodist says "build", "сборка", "generate jsx" after content has been reviewed. Copies infrastructure (AudioEngine, useAudio, base components, CSS) line-by-line from the infrastructure_v1 Notion page; uses etalon_v14.jsx (содержимое v15) only as a methodological reference for Screen-component structure and wording. Output is a runnable .jsx file with RU + UZ + audio, ready to preview in Claude artifacts.
---

# jsx-builder

Собирает финальный .jsx из CONTENT-объекта (от content-generator) и скелета (от skeleton-generator). Третий этап pipeline. После .jsx запускается qa-validator.

Главный принцип: скилл не пишет .jsx с нуля и не «вдохновляется» эталоном. У него **два разных источника**, и их нельзя путать:

1. **`infrastructure_v1`** (Notion-страница, ID `36d560538746817d9a0bc2e4d06d9ad2`) — **технический ориентир**. Отсюда копируется **строка-в-строку**: палитра T (с `shadowBase`), LangContext + useT (с поддержкой JSX), useIsMobile, AudioEngine (с pushOneOff), useAudio (со стабилизатором segments), makeAudioSegments, базовые компоненты (Op, Frac, AudioIndicator, FeedbackBlock, Stage с stage-header, NavBack, NavNext, NextLabel, BackLabel, Slider), универсальный QuestionScreen под формат `audio: { intro, on_correct, on_wrong }`, шаблон корневого компонента, CSS-блок (визуальный язык v15: тени вместо рамок, btn-white-accent, sticky-header, glow на progress-bar и slider).

2. **`etalon_v14`** (Notion-страница, ID `36a56053874681668917f461b82c6e62`, содержимое v15) — **методический референс**. Отсюда берутся только **образцы**, не код 1-в-1: как структурировать Screen-компонент для каждого типа (hook / exploration / rule / test / case / summary), как формулировать `wrong_N`, как разливать feedback, какой хронометраж у hook.

**При противоречии между ними побеждает `infrastructure_v1`.** Если в эталоне устаревший формат (например, до v15: рамки 1.5px, max-width 720, старый AudioEngine без pushOneOff) — используется актуальная версия из `infrastructure_v1`. На момент v15 эталон уже на 936px и тенях, расхождений нет.

**Никогда не правлю эталон.** Если кажется, что в эталоне «ошибка» (старый формат audio, старая ширина) — это не ошибка, это исторически зафиксированный методический образец. Все технические эволюции уходят в новую версию `infrastructure_vN`, не в эталон.

---

## АКТИВНЫЙ КУРС

Активный курс этого Project — математика (см. system_prompt раздел 1). При чтении shared-документов из Platform Standards (`screen_types`, `design_system`, `uz_locale`, `infrastructure_v1`) использую секции для math — не для english или code. Если соответствующая секция курса в shared-документе ещё не выделена — читаю общую часть.

---

## ПРИНЦИПЫ

1. **`infrastructure_v1` копируется как есть.** Я не «стараюсь сделать похоже». Я открываю страницу `infrastructure_v1` в Notion и копирую блок «Код инфраструктуры» в новый файл целиком. Если для нового урока требуется что-то, чего там нет (новый базовый компонент, новый хук) — это сигнал к `infrastructure_v2`, не свободное творчество в текущем файле.

2. **Эталон используется только как методический референс структуры Screen-компонентов.** Открываю `etalon_v14` (содержимое v15), смотрю Screen0..Screen14 как образцы того, *как разлить* экран нужного типа (hook, exploration step-by-step, rule, test-choice, test-input, case-setup, case-step, case-conclusion, summary). Беру оттуда **разливку JSX** (структура div'ов, frame-блоки, последовательность fade-up), но не код AudioEngine или CSS.

3. **Screen-компоненты — по шаблонам.** Каждый тип экрана имеет свой паттерн разливки. Эти паттерны хранятся в эталоне как Screen0..Screen14. Беру шаблон по типу/подтипу, подставляю поля из CONTENT.

4. **Поведение возврата — строго по типу экрана.** Hook полностью сбрасывает `picked` (через `useState(null)`, не из `storedAnswer`). Test сохраняет. Это не косметика, это методология. См. `screen_types.md` раздел 9.

5. **Корневой компонент принимает props от LMS.** Сигнатура — `({ lang, onFinished })`. Внутреннего переключателя ru/uz нет. Если в эталоне есть `lang-switch` или `useState('ru')` в корне — это preview-фича (только для прокликивания методистом). В production-выводе корневой компонент берётся из `infrastructure_v1` («Корневой компонент — шаблон»). LangContext инициализируется напрямую из `props.lang`. См. `content_schema` раздел 0.

6. **Я не правлю CONTENT.** Если в нём что-то не так (пропущенное поле, опечатка) — останавливаюсь и возвращаюсь к content-generator. Не «подправляю на ходу».

7. **Каждый scored-экран сохраняет в answers полную структуру для LMS payload.** Не только `{correct, picked}`, а все поля: `stage`, `screenIdx`, `question`, `options`, `correctIndex`, `correctAnswer`, `studentAnswerIndex`, `studentAnswer`, `correct`. См. `content_schema` раздел 0.3-0.6.

---

## ПРОЦЕДУРА

### Шаг 1 — Подготовка скелета файла

Беру технический слой из **`infrastructure_v1`** (Notion-страница). Открываю её через `notion-fetch`, копирую в новый файл следующие блоки **строка-в-строку**:

- Imports (стандартные React).
- Константа `T` (палитра) — целиком, включая `blue: '#019ACB'` и `shadowBase: '58, 53, 48'`.
- LangContext, useLang, useT — целиком (useT поддерживает JSX-фрагменты).
- `useIsMobile` хук — целиком.
- AudioEngine класс (с методом `pushOneOff`) + audioEngineInstance + getAudioEngine + useAudio (со стабилизатором segments) + makeAudioSegments — целиком, без правок.
- Базовые компоненты (Op, Frac, AudioIndicator, FeedbackBlock, Stage с useIsMobile и stage-header, NavBack, NavNext, NextLabel, BackLabel, Slider) — целиком.
- QuestionScreen — целиком. Читает CONTENT по формату `audio: { intro, on_correct, on_wrong }`. Принимает `storedAnswer`, `totalScreens`, `screenMeta` как props.
- Шаблон корневого компонента (блок «Корневой компонент — шаблон» в `infrastructure_v1`).
- `<style>` блок целиком (включая `max-width: 936px`, тени вместо рамок, `.btn-white-accent`, sticky `.stage-header`, glow на progress и slider, reset margins для h1-h6/p/ul/ol, уменьшённые вертикальные отступы, отсутствие `@import` шрифтов).

Что заполняю под конкретный урок:

- Комментарий-шапка — актуальная тема урока.
- `TOTAL_SCREENS` — число экранов нового урока.
- `LESSON_META` — `lessonId`, `lessonTitle` под урок.
- `SCREEN_META` — массив `{ id, type, template, scored, scope }` под скелет. Имена шаблонов и scope — строго по `screen_types.md` §1.5 (`MCScreen`, `NumInputScreen`, `custom`; `hook`, `module-mikro`, `final`, `null`).
- `CONTENT` — целиком из content-generator.
- Screen-компоненты (Screen0..ScreenN) — генерирую под структуру нового урока (см. Шаг 2).
- Массив `screens` в корневом компоненте — список Screen-компонентов в порядке.
- Имя экспорта — `TrigonometryLesson`, `FractionsLesson`, и т.д.

Что НЕ беру из эталона, даже если соблазн есть:

- Старую палитру без blue или без shadowBase.
- Старый `useT` без поддержки JSX.
- Старый AudioEngine без pushOneOff.
- Старый Stage без stage-header (когда progress + chrome ещё жили внутри stage-content).
- Старый QuestionScreen с `audio_q + audio_fb_*`.
- Корневой компонент со встроенным `useState('ru')` и lang-switch в production-выводе.
- `<style>` блок с `max-width: 720px`, с рамками 1.5px ink на frame/option/btn, или с `@import url(...)` для Google Fonts.

Все эти куски могут оставаться в эталоне исторически. В новых уроках они приходят из `infrastructure_v1` в актуальном виде.

### Шаг 2 — Генерация Screen-компонентов

Открываю **`etalon_v14`** (содержимое v15) как методический референс структуры. Для каждого экрана урока выбираю шаблон по типу:

| Тип экрана | Шаблон-образец в эталоне | Подход |
|---|---|---|
| `hook` | `Screen0` | Адаптировать число `title_partN`, использовать `opt_yes/no/idk`. **При возврате — полный сброс picked** (см. `screen_types.md` 9). |
| `exploration / step-by-step` | `Screen1` | Адаптировать число шагов (`step < N` в `handleStep`). Добавить `stepEndRef` + useEffect для автоскролла к появляющемуся блоку. |
| `exploration / slider` | `Screen2` | Адаптировать диапазон ползунка (min/max), условия `fits*`. **Кнопка «Проверить» — справа** через `<div style={{ display: 'flex', justifyContent: 'flex-end' }}>`, класс `.btn-white-accent` (см. `design_system.md` §10). |
| `rule` | `Screen3` или `Screen5` | По наличию `outro` и сложности example-блока. |
| `rule / step-by-step разбор` | `Screen7` | Многошаговый разбор в `.frame` (4 шага). |
| `test / choice` | `Screen4`, `Screen8`, `Screen10..13` | Структура из эталона, аудио по формату `audio: { intro, on_correct, on_wrong }` (см. Шаг 4). QuestionScreen из `infrastructure_v1` уже это поддерживает. |
| `test / input` | `Screen6` | Поле ввода + ручное `submit`. Placeholder — нейтральное `0,0` или `0`, не правильный ответ. **Кнопка «Проверить» — справа** через `<div style={{ display: 'flex', justifyContent: 'flex-end' }}>`, класс `.btn-white-accent`. |
| `case / setup` | `Screen9` | Карточки-факты + CTA «Помочь». |
| `case / step` | `Screen10`, `Screen11` | Структура test-choice. |
| `case / conclusion` | `Screen12` | Структура test-choice с интерпретационным вопросом. |
| `summary` | `Screen14` | Счёт + блок «Главное». |

Подставляю поля CONTENT через `t(c.field_name)`. Не использую дробные литералы (`1/2`) в JSX — только через `<Frac n="1" d="2"/>`. Не использую кавычки в JSX-тексте — только через `t()` обращение к CONTENT.

### Шаг 3 — Условный рендеринг RU/UZ для разной структуры

Если у экрана RU и UZ имеют разный порядок слов (SOV в UZ требует другой структуры) — использую `{lang === 'uz' ? (...) : (...)}` (см. `Screen6` в эталоне, экраны 7, 8, 11, 12, 13).

Признак, что нужен условный рендер: в CONTENT есть поля типа `title_ru_part1` + `title_uz_suffix` (явные `_ru_` / `_uz_` в именах).

Если RU и UZ имеют одинаковую структуру — один общий шаблон без условного рендера. Признак: только `title_partN` без `_ru_`/`_uz_` префиксов.

### Шаг 4 — Аудио-обвязка

Структура `audio` в CONTENT зависит от типа экрана. См. `audio_rules.md` раздел 8 и `content_schema.md` 3.3.

**Для MC-экранов** (hook, test-choice, case-step, case-conclusion) — `audio: { intro, on_correct, on_wrong }`:

```javascript
// В Screen-компоненте:
const segments = [{
	id: 'intro',
	text: t(c.audio.intro),
	trigger: 'on_mount',
	waits_for: { type: 'option_picked' }   // для MC
}];
useAudio(segments);
// В обработчике выбора:
const handlePick = (idx) => {
	setPicked(idx);
	setRevealed(true);
	const correct = idx === correctIdx;
	const fbAudio = correct ? c.audio.on_correct : c.audio.on_wrong;
	audioEngineInstance.pushOneOff(t(fbAudio));
	// ... запись в answers ...
};
```

Если используется универсальный `QuestionScreen` из `infrastructure_v1` — он уже это делает сам, передаю ему `screenContent={c}` и `correctIdx`.

**Для test-input** — та же структура, но `waits_for: { type: 'check_pressed' }`.

**Для custom-экранов** (exploration, rule, case-setup, summary) — старая форма билингвального объекта:
- Один сегмент (rule, case-setup, простые summary): `audio: { ru: '...', uz: '...' }`.
- Несколько сегментов (exploration step-by-step, summary с разбором): `audio: { ru: [...], uz: [...] }` — билингвальный массив.

Триггеры `on_event:step_N`, прерывания на `button_click`/`option_picked` — реализовано в AudioEngine из `infrastructure_v1`, дополнительной обвязки не требуется.

### Шаг 5 — Поведение возврата

В каждом Screen-компоненте, требующем сохранения состояния. Принимает `storedAnswer` prop от корневого компонента (см. `screen_types.md` раздел 9).

**Test-choice / case-step / case-conclusion** (сохраняется полностью):
```javascript
const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
const [revealed, setRevealed] = useState(storedAnswer !== undefined);
```

**Test-input** (сохраняется полностью):
```javascript
const [value, setValue] = useState(storedAnswer?.studentAnswer ?? '');
const [revealed, setRevealed] = useState(storedAnswer !== undefined);
```

**Hook** (полный сброс при возврате):
```javascript
const [picked, setPicked] = useState(null);
```

Это правило из `screen_types.md` 9. Hook — это провокация-вопрос, она теряет смысл, если ответ уже виден. Обрати внимание: ранние версии эталона могли иметь `useState(storedAnswer?.picked ?? null)` для hook — это **устаревшее поведение**, в новых уроках используется полный сброс.

**Exploration / slider** (сбрасывается):
```javascript
const [n, setN] = useState(2); // начальное значение, не из storedAnswer
const [checked, setChecked] = useState(false);
```

**Exploration / step-by-step** (сбрасывается):
```javascript
const [step, setStep] = useState(0);
```

Это жёсткое правило, проверяет qa-validator.

### Шаг 6 — Финальная сборка корневого компонента

Беру шаблон корневого компонента из **`infrastructure_v1`** («Корневой компонент — шаблон»). Заполняю под урок:
- Имя функции (`FractionsLesson`, `TrigonometryLesson`, ...).
- Массив `screens` (список Screen-компонентов в порядке).
- `LESSON_META`, `SCREEN_META`, `TOTAL_SCREENS` определены рядом с CONTENT в файле.

Шаблон корневого компонента в `infrastructure_v1` уже содержит:
- Сигнатуру `({ lang: langProp, onFinished })` с preview-fallback.
- `startTimeRef = useRef(Date.now())` для durationSec.
- `recordAnswer`, `reset` callbacks.
- `finishLesson` — собирает payload по правилам `content_schema.md` 0.3-0.6 и вызывает `onFinished(payload)`.
- `LangContext.Provider value={lang}` без внутреннего useState.

Я ничего из этого не переписываю. Только подставляю screens и имена.

LESSON_META — рядом с CONTENT в файле:
```javascript
const LESSON_META = {
	lessonId: 'frac-5-06-v1',
	lessonTitle: { ru: '...', uz: '...' }
};
```

SCREEN_META — рядом с CONTENT, отражает поля из скелета:
```javascript
const SCREEN_META = [
	{ id: 's0', type: 'hook',  template: 'MCScreen', scored: false, scope: 'hook' },
	{ id: 's1', type: 'exploration', template: 'custom', scored: false, scope: null },
	// ... и так далее для всех экранов ...
];
```

`SCREEN_META` нужен, чтобы корневой компонент мог посчитать payload без чтения CONTENT.

Что записывает Screen в `recordAnswer(data)`:
```javascript
{
	stage: SCREEN_META[idx].scope,
	screenIdx: idx,
	question: t(c.question || c.title_partN /* собрать сводно */),
	options: c.options ? c.options.map(o => t(o)) : null,
	correctIndex: c.correctIndex ?? null,
	correctAnswer: c.correctIndex != null ? t(c.options[c.correctIndex]) : null,
	studentAnswerIndex: picked,
	studentAnswer: picked != null ? t(c.options[picked]) : null,
	correct: picked === c.correctIndex
}
```

Для test-input — `options/correctIndex/correctAnswer/studentAnswerIndex: null`, `studentAnswer: value`, `correct: проверка по экранной логике`.

`TOTAL_SCREENS` ставлю равным длине массива `screens`.

### Шаг 7 — Самопроверка перед выдачей

Прохожу мысленно:

- Все экраны из CONTENT представлены Screen-компонентами?
- Все Screen-компоненты в массиве `screens`?
- `TOTAL_SCREENS` совпадает с длиной массива?
- Нет ссылок на поля CONTENT, которых нет в объекте?
- `useAudio` подключён в каждом Screen?
- Поведение возврата соответствует типу экрана? (Hook — `useState(null)`, test — из storedAnswer.)
- Корневой `export default function` принимает `({ lang, onFinished })`?
- `LangContext.Provider` инициализируется из `props.lang`, не из `useState`?
- `startTimeRef = useRef(Date.now())` присутствует?
- `LESSON_META` и `SCREEN_META` определены?
- На финальном экране `finishLesson()` вызывает `onFinished(payload)` ровно один раз?
- `useIsMobile` хук определён и используется в Stage?
- В `<style>` нет `@import url(...)` для шрифтов?
- `.stage` имеет `max-width: 936px` (не 720px)?
- **`.stage-header` вынесен из `.stage-content`** (sticky, `flex-shrink: 0`), и прогресс-бар + chrome находятся внутри `.stage-header`?
- **На экранах с интерактивным виджетом (slider, input) кнопка «Проверить» размещена справа** через `<div style={{ display: 'flex', justifyContent: 'flex-end' }}>` и использует класс `.btn-white-accent`?
- **CSS содержит токены v15**: `shadowBase` в `T`, тени вместо рамок 1.5px на `.frame`/`.option`/`.answer-input`/`.btn*`, glow на `.progress-bar` и `.track-fill`, reset margins для `h1-h6`/`p`/`ul`/`ol`?
- Нет внутреннего переключателя ru/uz (`useState('ru')` или подобного) в production-выводе?
- Test-input placeholder — нейтральный (`0,0` или `0`), не правильный ответ?

**Целостность инфраструктуры — отдельная критическая проверка.** Делаю diff между скопированной инфраструктурой (AudioEngine, useAudio, базовые компоненты, CSS) и **страницей `infrastructure_v1`**. Строки должны совпадать **строка-в-строку** (включая пробелы, комментарии, имена методов).

Если есть отличия — это критический баг. Возвращаюсь к Шагу 1 и копирую инфраструктуру заново, явно из `infrastructure_v1`. Это диагноз «тихого» неработающего аудио: внешне всё на месте, по факту — TTS молчит из-за минорной мутации в useAudio (потерянный стабилизатор segments) или в AudioEngine.

---

## КРИТИЧЕСКИЕ ТЕХНИЧЕСКИЕ ПРАВИЛА

Эти правила выработаны итерациями инфраструктуры и не пересматриваются:

1. **Sticky-кнопки через flex + 100dvh**, не через `padding-bottom + position: sticky`. CSS уже в `<style>` блоке `infrastructure_v1` — не трогать. См. `design_system.md` раздел 5.1.

2. **`100dvh`, не `100vh`.** На мобильных `vh` ломается из-за address bar. `dvh` — динамическая высота.

3. **FeedbackBlock через двойной `requestAnimationFrame`.** Не CSS-keyframes. Реализация в `infrastructure_v1` в компоненте `FeedbackBlock`. Скопировать как есть.

4. **Автоскролл к появляющемуся feedback** — через `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` с `setTimeout` 100-350ms. Реализован в `FeedbackBlock` из `infrastructure_v1`. Для step-by-step экранов автоскролл к появляющемуся блоку реализуется отдельно — добавляю `stepEndRef` + useEffect в Screen-компонент. На slider-экранах (где feedback появляется ниже кнопки «Проверить» справа) использую `block: 'end'` + timeout 200ms — иначе при частично видном feedback браузер не докручивает.

5. **JS-строки с UZ-контентом** — двойные кавычки или backticks. Никогда одинарные. Это синтаксически ломается из-за апострофов внутри узбекских слов (`to'g'ri`).

6. **Inline-математика через `<Frac>` и `<Op>`**, не как текст. `<Frac n="1" d="2"/>`, не `"1/2"`.

7. **i18n-пробелы** — в значениях CONTENT, не в JSX-разметке. См. `content_schema.md` раздел 9.

8. **Max-width `.stage` — 936px**, не 720px. Эталон (страница `etalon_v14`, содержимое v15) тоже на 936. См. `design_system.md` 5.2.

9. **Шрифты приходят от LMS.** Никаких `@import url(...)` для Google Fonts внутри `<style>` блока. LMS подгружает Source Serif 4, Manrope, Fraunces, JetBrains Mono на уровне приложения. В CSS-правилах урока — только `font-family: 'Source Serif 4', serif;` с fallback. См. `design_system.md` раздел 2.1.

10. **Display-размеры** (display, font-size) не превышают значений эталона. Уменьшать можно, увеличивать — только с явным согласованием методиста. В v15 все upper bounds в `clamp(min, vw, max)` × 0.85 относительно v14; lower bounds не тронуты. См. `design_system.md` §3.5.

11. **`useAudio` содержит стабилизатор segments** через ref-кэш с JSON-сравнением. Это критично: без него inline-литералы `useAudio([{...}])` в Screen-компонентах создают новую ссылку на каждом рендере, useEffect пересоздаётся, cleanup делает `engine.stop()` → `cancel()` → новый speak → новый рендер → cancel-loop, звук не играет.

    Конкретно: внутри `useAudio` должен быть блок:
```javascript
const segmentsRef = useRef(segments);
const segmentsKey = segments ? JSON.stringify(segments) : '';
const prevKeyRef = useRef(segmentsKey);
if (prevKeyRef.current !== segmentsKey) {
	segmentsRef.current = segments;
	prevKeyRef.current = segmentsKey;
}
const stableSegments = segmentsRef.current;
```
И `useEffect` зависит от `stableSegments`, не `segments`:
```javascript
useEffect(() => { ... }, [stableSegments, lang]);
```
    Этот блок есть в `infrastructure_v1`. Я копирую `useAudio` оттуда как есть. Если случайно скопировал из старой версии эталона (без стабилизатора) — звук в новом уроке не работает. QA-validator проверяет наличие `segmentsRef` и `stableSegments` в собранном файле.

12. **Корневой компонент принимает `{ lang, onFinished }` как props.** Не использует внутренний `useState('ru')` в production-выводе. LangContext инициализируется напрямую из `props.lang`. Шаблон корневого — в `infrastructure_v1`.

13. **`onFinished(payload)` вызывается ровно один раз** — на финальном экране при нажатии «Завершить». Не на mount, не несколько раз. Структура payload — строго по `content_schema.md` 0.3-0.6.

14. **`useIsMobile`** — обязательный helper в инфраструктуре. `Stage` из `infrastructure_v1` уже использует его для адаптивных padding (`isMobile ? 12 : 100`). См. `design_system.md` раздел 5.0.

15. **Внутри урока нет вызовов LMS API.** Никаких `fetch`, `localStorage`, `sessionStorage`, `cookies`. Связь с LMS — только через `onFinished` payload.

16. **AudioEngine содержит метод `pushOneOff(text)`** для подачи on_correct/on_wrong аудио после ответа на MC-экранах. Реализация в `infrastructure_v1`. Прямой `engine.queue.push(...)` — устаревший паттерн, в новых уроках не применяется.

17. **`useT` поддерживает JSX-фрагменты** — содержит проверку `if (React.isValidElement(node)) return node;`. Нужно для feedback-полей test-input, где `fb_correct` / `fb_wrong` могут быть JSX. Реализация в `infrastructure_v1`.

18. **Визуальный язык v15.** Когда копирую CSS из `infrastructure_v1`, получаю готовый v15:
    - Тени вместо рамок 1.5px ink (`.frame`, `.option`, `.answer-input`, `.btn*` — без border, на shadow из `shadowBase`)
    - `.btn-white-accent` — главная CTA (белая, оранжевая тень, оранжевый текст; на hover заливается оранжевым с белым текстом)
    - `.btn-ghost` — вторичная CTA «Назад» (прозрачная без тени → белая карточка с нейтральной тенью на hover)
    - `.btn` — резерв (Dark CTA, тёмная), используется редко
    - **Sticky-header**: progress-bar + chrome вынесены из `.stage-content` в отдельный `.stage-header` (`flex-shrink: 0`, фон `T.bg`)
    - **Slider** — компонент `<Slider>` с разметкой `track-wrap + track-bg + track-fill`, оранжевая `track-fill` с glow, handle с равномерной круговой тенью (offset-y = 0)
    - Progress-bar и dot в chrome — с orange glow
    - Polosa 4px слева в `.frame-soft`/`.frame-success` сохранена как намеренное исключение (функциональный сигнал статуса)
    - Reset margins для `h1-h6`, `p`, `ul`, `ol` внутри `.lesson-root`

    Я не воссоздаю это вручную. Копирую из `infrastructure_v1` целиком. См. `design_system.md` §1.3, §4.1–4.8.

19. **Промежуточная CTA «Проверить»** (на slider-, input- и других экранах с локальным шагом проверки внутри одного экрана) — **справа** в отдельной строке через flex container, класс `.btn-white-accent`:
```javascript
<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
	<button className="btn-white-accent" disabled={!ready} onClick={check}>
		{t(c.btn_check)}
	</button>
</div>
```
    Не `.btn` с `alignSelf: 'flex-start'` слева (как в более ранних версиях эталона). Глобальная CTA «Дальше» в `.stage-nav` справа — промежуточная «Проверить» в той же оси. См. `design_system.md` §10.

---

## НЕТИПОВЫЕ СЛУЧАИ

### Новый тип виджета (нет в эталоне)

Например, методист хочет drag-and-drop вместо ползунка. В эталоне drag-and-drop нет, в `infrastructure_v1` базового компонента для него тоже нет.

Что делаю: не пытаюсь сразу написать новый виджет. Останавливаюсь: «Drag-and-drop виджета нет ни в эталоне как методическом образце, ни в `infrastructure_v1` как готовом компоненте. Реализация потребует расширения. Варианты: (1) заменить на ползунок с похожей логикой, (2) реализовать drag-and-drop в этом уроке как кастомный экран (приблизительно 30-50 строк JSX), но если он войдёт в 2+ урока — выносить в `infrastructure_v2`. Что выбираешь?». Жду решения.

### Экран требует больше 4 опций или нестандартное число шагов

Например, test с 5 вариантами или exploration с 6 шагами.

Что делаю: возвращаюсь к скелету. «В скелете на экране [N] требуется 5 вариантов / 6 шагов — это превышает паттерн эталона (4 / 3-4 шага). Это сознательное решение или ошибка скелета?». Если методист подтверждает — расширяю шаблон, явно отмечаю как отступление от эталона.

### CONTENT содержит JSX-фрагменты в полях

Например, `fb_correct: { ru: <>...</>, uz: <>...</> }`. Это валидно для test-input (см. `content_schema.md` раздел 4.6), но не для большинства полей.

Что делаю: для test-input — подставляю как есть, через `t()` (`useT` из `infrastructure_v1` распознаёт JSX-фрагменты и возвращает их без преобразования). Для других типов — это ошибка CONTENT, останавливаюсь и возвращаю к content-generator.

### Эталон содержит known issue или устаревший паттерн в скопированном куске

Эталон имеет три поля с sen-формами (s5.title_part1, s5.title_part2_em, s14.main_3 — см. `uz_locale.md` раздел 11) и может иметь другие исторические особенности. Но эти куски — в CONTENT и в инфраструктурной части эталона, а:
- CONTENT нового урока приходит от content-generator с актуальной структурой (новый формат audio, siz вместо sen).
- Инфраструктура копируется из `infrastructure_v1`, не из эталона.

То есть проблема не возникает: я работаю с новым CONTENT и с `infrastructure_v1`, не с устаревшими кусками эталона.

### Методист просит «оптимизировать» .jsx

Например, «сократи дублирование», «вынеси повторяющийся код».

Что делаю: не делаю до подтверждения. «Это изменит инфраструктуру. Если оптимизация полезна — её надо вносить в `infrastructure_v2` централизованно, а не в одном уроке. Готов предложить изменение для `infrastructure_v2` (отдельно), или оставляем как есть?».

---

## ВЫХОД

Полный .jsx файл, готовый к запуску на LMS-платформе. Структура:

```jsx
import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: [тема]
// [метаданные]
// --- ИЗ infrastructure_v1 (строка-в-строку) ---
const T = { /* палитра с blue и shadowBase */ };
const LangContext = createContext('ru');
const useLang = () => useContext(LangContext);
const useT = () => { /* с поддержкой JSX */ };
function useIsMobile(breakpoint = 640) { /* ... */ }
class AudioEngine { /* с pushOneOff */ }
let audioEngineInstance = null;
const getAudioEngine = () => { /* ... */ };
function useAudio(segments) { /* со стабилизатором segments */ }
const makeAudioSegments = ...;
const Op = ...;
const Frac = ...;
const AudioIndicator = ...;
const FeedbackBlock = ...;
const Slider = ...; // компонент v15 с track-bg + track-fill
const Stage = ...; // с useIsMobile и stage-header
const NavBack = ...;
const NavNext = ...;
const NextLabel = ...;
const BackLabel = ...;
const QuestionScreen = ...; // под audio: { intro, on_correct, on_wrong }
// --- ПОД УРОК ---
const TOTAL_SCREENS = [N];
const LESSON_META = {
	lessonId: 'frac-5-06-v1',
	lessonTitle: { ru: '...', uz: '...' }
};
const SCREEN_META = [
	{ id: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
	// ... один объект на каждый экран ...
];
const CONTENT = {
	// от content-generator
};
const Screen0 = ...;
const Screen1 = ...;
// ...
const ScreenN = ...;
// --- КОРНЕВОЙ КОМПОНЕНТ (шаблон из infrastructure_v1) ---
export default function FractionsLesson({ lang: langProp, onFinished }) {
	const lang = langProp || 'ru';
	// ... safeOnFinished, state, recordAnswer, finishLesson (см. Шаг 6) ...
	const screens = [Screen0, Screen1, /* ... */, ScreenN];
	return (
		<LangContext.Provider value={lang}>
			<style>{STYLES}</style>
			<div className="lesson-root">
				<CurrentScreen ... />
			</div>
		</LangContext.Provider>
	);
}
// --- CSS из infrastructure_v1 (визуальный язык v15) ---
const STYLES = `...`;
```

Выдаю в одном code-блоке для удобства копирования методистом.

Дополнительно (отдельно от кода):
- Краткая заметка: «Файл собран, [N] экранов, общая длина ~[M] строк. Инфраструктура из `infrastructure_v1` (визуальный язык v15). Используется столько-то типов экранов, столько-то экранов с условным рендером RU/UZ. Шрифты — через LMS. Готово к запуску qa-validator.»

---

## ОПИРАЮСЬ НА (knowledge base)

**Platform Standards** (общий слой):
- **`infrastructure_v1`** (ID `36d560538746817d9a0bc2e4d06d9ad2`) — главный источник технического кода. Палитра (с `shadowBase`), AudioEngine, useAudio, базовые компоненты (включая Slider), Stage с stage-header, QuestionScreen, шаблон корневого, CSS визуального языка v15 — оттуда строка-в-строку. Курсо-специфичные UI-компоненты (Frac/Op для math) — в секции math этого документа.
- `content_schema` — раздел 0 (props + payload + storedAnswer), раздел 3.3 (формат audio для MC), раздел 4 (поля по типам), раздел 7 (скелет с template/scored/scope), раздел 9 (i18n-пробелы).
- `screen_types` — раздел 1.5 (template/scored/scope), раздел 2 (hook reset), раздел 3 (exploration с кнопкой «Проверить» справа), раздел 5 (test-input placeholder ≠ ответ, кнопка «Проверить» справа), раздел 9 (поведение возврата). Секция math.
- `design_system` — раздел 1 (палитра с blue и shadowBase), §1.3 (система теней), §2.1 (шрифты от LMS), §3.5 (display-размеры × 0.85), §4.1–4.8 (компоненты v15), §5.0 (useIsMobile + padding 100/12), §5.1 (stage-header), §5.2 (max-width 936), §6.3 (progress с glow), §7 (что не трогаем), §8 (SVG sizing), §9 (SVG-фигуры), **§10 (промежуточная CTA «Проверить» справа)**. Секция math.
- `audio_rules` — раздел 8 (сегментный протокол, pushOneOff, CONTENT-структура audio для MC).
- `uz_locale` — раздел 2.4 (двойные кавычки в JS-строках).

**Math** (course):
- **`etalon_v14`** (ID `36a56053874681668917f461b82c6e62`, содержимое v15) — методический референс структуры Screen-компонентов (как разлить hook, exploration, rule, test, case, summary). Не источник инфраструктуры. Не правится никогда.

НЕ касаюсь:
- `methodology` — методика уже впитана в скелет и CONTENT.

---

## ЧТО Я НЕ ДЕЛАЮ

- Не пишу .jsx с нуля. Беру инфраструктуру из `infrastructure_v1`.
- Не копирую инфраструктуру из эталона — там может быть устаревший код (старый AudioEngine без pushOneOff, max-width 720, рамки 1.5px). Эталон — методический референс, не технический.
- Не правлю инфраструктуру в одном уроке. Если нужно изменение — это сигнал к `infrastructure_v2`.
- Не правлю эталон, никогда.
- Не «оптимизирую» код, делая его непохожим на `infrastructure_v1`.
- Не правлю CONTENT, даже если вижу проблему. Возвращаюсь к content-generator.
- Не использую кавычки в JSX-тексте — только через `t()` обращения.
- Не делаю inline-математику текстом — только через `<Frac>` и `<Op>`.
- Не запускаю qa-validator сам. Жду методиста.
- Не выдаю частичный .jsx (например, «только новые Screen-компоненты»). Либо полный файл, либо явный отказ.
- Не использую `100vh` — только `100dvh`.
- Не подключаю проприетарные шрифты, локальные шрифты или иконочные библиотеки.
- Не копирую `@import url(...)` — шрифты приходят от LMS.
- Не использую внутренний переключатель ru/uz в корневом компоненте production-выводе — `lang` приходит как prop.
- Не пропускаю вызов `onFinished(payload)` на финальном экране.
- Не делаю `fetch`, `localStorage`, или другие сетевые/хранимые вызовы из урока.
- Не использую `max-width: 720px` — 936.
- Не использую рамки 1.5px ink на `.frame`/`.option`/`.answer-input`/`.btn*` — только тени из v15-токенов.
- Не размещаю промежуточную кнопку «Проверить» слева через `alignSelf: 'flex-start'` — справа через flex container, `.btn-white-accent`.
- Не использую placeholder, совпадающий с правильным ответом, в test-input.
