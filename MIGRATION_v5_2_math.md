# Миграция math-урока на TTS-контракт v5.2

Рунбук для перевода урока математики с контракта **v5.1 → v5.2**. Можно вставить как промт в новый чат (приложив `.jsx` урока), либо применить локально скриптом / поиском-заменой.

> **Важно, чтобы не было ложных ожиданий.** Эта миграция — только про формат запроса к TTS. Она **не** включает звук на платформе. Если урок молчит на сайте — причина в бэкенде (квота/ключ ElevenLabs), а не в контракте, и миграция этого не лечит.

---

## 1. Когда применять

- Курс — **math**. Контент и Screen-компоненты не трогаем, только движок/контракт.
- Применять к урокам на **v5.1**. Признаки см. в п.2.
- НЕ применять к английским/кодовым урокам (другая инфраструктура).

## 2. Как определить версию урока

Открой `.jsx`, найди строку `function buildTtsUrl`:

- **v5.1 → нужна миграция.** Есть `function buildTtsUrl(base, text, lang, gender)` и строка `const tagged = TAG_RE.test(raw) ? raw : ...` (движок сам прибавляет языковой тег). Нет `voiceGender`, нет метода `setGender`.
- **v5.2, но подрезанный** (случай вроде `frac_5_01`). `buildTtsUrl(base, text, gender)` уже без `lang`, но в классе движка **нет** `setGender`, а `playSegment` читает `ttsConfig.voiceGender` напрямую. Нужно только выравнивание — правки №5, 6, 7 ниже (добавить `setGender` + вызвать его).
- **Полный v5.2 → не трогать.** В классе движка есть `setGender(g) { ... }` и в `useAudio` есть `engine.setGender(...)`.

## 3. Что меняем (суть)

Эндпоинт v5.2 принимает **только `text` и `g`**. Поэтому:
1. из `buildTtsUrl` убираем `lang` (и из сигнатуры, и из URL);
2. убираем прибавление языкового тега — math шлёт одноязычную строку **без маркеров**, сервер сам определяет язык (ru=кириллица, uz=латиница);
3. добавляем проп `voiceGender` (дефолтный пол голоса от платформы) + метод `setGender` в движок; посегментный `g` (персонаж) по-прежнему переопределяет дефолт.

---

## 4. Вариант A — автоскрипт (надёжно, рекомендуется)

Сохрани как `migrate_v52.py` рядом с уроками и запусти:

```
python migrate_v52.py "D:\Boyazid\Matematika jsx\src\components\Dars03.jsx"
```

Скрипт идемпотентный: уже применённые правки пропускает, перезапись безопасна. Делает копию `*.bak` перед записью.

```python
import sys, shutil

EDITS = [
    ("ttsConfig +voiceGender",
     "aiGradingEndpoint: '', studentName: '' };",
     "aiGradingEndpoint: '', studentName: '', voiceGender: 'm' };"),

    ("TAG_RE +end / +END_TAG",
     "const TAG_RE = /\\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation)\\]/;",
     "const END_TAG = '[end]';\nconst TAG_RE = /\\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation|end)\\]/g;"),

    ("stripAudioTags +end",
     "? s.replace(/\\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation)\\]\\s*/g, '')",
     "? s.replace(/\\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation|end)\\]\\s*/g, '')"),

    ("buildTtsUrl v5.1->v5.2",
     """// HTTP TTS: {base}/api/tts?text=<теги+текст, encoded>&g=m|f
// Если в тексте уже есть языковой тег (смешанные языки) — свой не добавляем.
function buildTtsUrl(base, text, lang, gender) {
  const tag = LANG_TAG[lang] || LANG_TAG.ru;
  const raw = String(text);
  const tagged = TAG_RE.test(raw) ? raw : `${tag} ${raw}`;
  const enc = encodeURIComponent(tagged.slice(0, 1000)).replace(/%5B/g, '[').replace(/%5D/g, ']');
  const g = gender === 'f' ? 'f' : 'm';
  return `${base}/api/tts?text=${enc}&g=${g}`;
}""",
     """// HTTP TTS v5.2: {base}/api/tts?text=<encoded>&g=m|f — ТОЛЬКО text + g.
// Язык — маркерами внутри text (только смешанные строки языковых курсов); math шлёт без маркеров,
// сервер определяет язык сам (ru=кириллица, uz=латиница). Движок свой тег НЕ добавляет.
function buildTtsUrl(base, text, gender) {
  const raw = String(text);
  const enc = encodeURIComponent(raw.slice(0, 1000)).replace(/%5B/g, '[').replace(/%5D/g, ']');
  const g = gender === 'f' ? 'f' : 'm';
  return `${base}/api/tts?text=${enc}&g=${g}`;
}"""),

    ("setGender в движке",
     "  setLang(lang) { this.currentLang = lang; }\n",
     "  setLang(lang) { this.currentLang = lang; }              // только preview Web Speech\n  setGender(g) { this.gender = g === 'f' ? 'f' : 'm'; }   // дефолтный пол голоса (v5.2); segment.g переопределяет\n"),

    ("playSegment: убрать lang",
     "    const lang = segment.lang || this.currentLang;\n    const gender = segment.g || this.gender;\n    el.src = buildTtsUrl(base, segment.text, lang, gender);",
     "    const gender = segment.g || this.gender;\n    el.src = buildTtsUrl(base, segment.text, gender);"),

    ("useAudio: вызвать setGender",
     "    engine.setLang(lang);\n    engine.onStateChange = (s) => setState(prev => ({ ...prev, ...s }));",
     "    engine.setLang(lang);\n    engine.setGender(ttsConfig.voiceGender || 'm');\n    engine.onStateChange = (s) => setState(prev => ({ ...prev, ...s }));"),

    ("сигнатура корня +voiceGender",
     "  studentName, lang: langProp, ttsApiBase,\n  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,",
     "  studentName, lang: langProp, ttsApiBase, voiceGender,\n  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,"),

    ("configureLesson +voiceGender",
     "aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName });",
     "aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'm' });"),
]

def main(path):
    s = open(path, encoding="utf-8").read()   # CRLF -> LF в памяти
    ok = skip = miss = 0
    for label, old, new in EDITS:
        if old in s:
            s = s.replace(old, new, 1); ok += 1; print(f"[OK]   {label}")
        elif new in s:
            skip += 1; print(f"[skip] {label} — уже применено")
        else:
            miss += 1; print(f"[!!]   {label} — НЕ найдено. Проверь файл вручную.")
    shutil.copyfile(path, path + ".bak")
    open(path, "w", encoding="utf-8", newline="\r\n").write(s)  # вернуть CRLF
    print(f"\nИтог: применено {ok}, пропущено {skip}, не найдено {miss}.")
    print(f"Бэкап: {path}.bak")
    if miss:
        print("ВНИМАНИЕ: есть [!!]. Файл, возможно, нестандартной структуры — пришли его в чат на проверку.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print('Использование: python migrate_v52.py "путь\\к\\уроку.jsx"'); sys.exit(1)
    main(sys.argv[1])
```

## 5. Вариант B — вручную (поиск-замена)

Если без скрипта. В редакторе (VS Code: Ctrl+H). Пары «найти → заменить» — те же 9, что в скрипте выше: бери из блока `EDITS` левую строку как «найти», правую как «заменить». Многострочный блок `buildTtsUrl` проще менять скриптом — вручную легко промахнуться по пробелам.

---

## 6. Проверка после правки

Самое простое — открой `.jsx` в превью Claude (artifacts): должен отрендериться без ошибок, в превью кнопки звука работают через браузерный голос.

Проверки поиском по файлу (должно быть так):
- `buildTtsUrl(` в HTTP-вызове — **без** `lang`: `buildTtsUrl(base, segment.text, gender)`.
- `function buildTtsUrl(base, text, gender)` — три параметра, не четыре.
- В движке есть `setGender(g)`, в `useAudio` есть `engine.setGender(`.
- `voiceGender` есть в сигнатуре корня и в `configureLesson`.
- `?text=` в URL — рядом только `&g=`, нет `&lang=`/`&voice=`/`&mood=`/`&provider=`.
- `window.speechSynthesis` встречается **только** в preview-ветке (`playSegmentPreview`), не в `playSegment`.

---

## 7. Не трогать / известные нюансы

- **CONTENT и Screen-компоненты — НЕ менять.** Только движок и контракт. Тексты, дроби, имена, диагностики остаются как есть.
- **Движок берём из `infrastructure_v1`, никогда не копируем из старого урока.** Старые файлы несут до-v5.2 или подрезанную инфру.
- **`scored: true`** на части экранов — это **отдельный вопрос политики оценивания** (конфликт qa-validator/teaching_methodology vs ревизия инфры 6 июн). Решает Фузайл. В рамках миграции v5.2 это **не трогаем**.
- **Звук на платформе** зависит от квоты/ключа ElevenLabs (бэкенд). Миграция переводит урок на правильный контракт, но «заговорит» он только когда бэкенд отдаёт аудио.
- **Preview RU/UZ-свитчер** в корне (если у урока его нет, как у `nat_5_03`) — опционально, на контракт и на платформу не влияет, только на удобство превью в artifacts.

---

## 8. Если используешь это как промт для Claude

Вставь этот файл в новый чат, приложи `.jsx` урока и напиши: «мигрируй под этот промт». Ожидаемый результат: определение версии → правки п.4 → компиляция → QA по п.6 → готовый `*_v5_2.jsx`. Урок, который оказался нестандартной структуры (правки не находятся дословно) — не правь вслепую, пришли в чат.
