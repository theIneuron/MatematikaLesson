# `jsx-question` — JSX Test Question Contract

A `jsx-question` is a test question whose **entire UI, options, correctness
check and result rendering live inside a single `.jsx` file** authored by a
mentor (optionally via AI). The frontend downloads the JSX from a URL, compiles
it at runtime and renders it inside the normal test flow (tabs, retry, scoring,
lesson completion).

The frontend does **not** know anything about the question's shape — it only
knows the prop contract below and the uniform result the JSX emits.

---

## 1. Question record (backend → frontend)

```jsonc
{
  "id": 12345,
  "type": "jsx-question",
  "other": {
    "jsx_url": "/lessons/color-warm.jsx"   // relative (VITE_FILE_URL) or absolute https URL
  }
}
```

- `jsx_url` may be relative (joined onto `VITE_FILE_URL`, passes through the
  Vite dev proxy with upstream Basic Auth) or an absolute `https://…` URL.
- The JSX file is fetched as plain text and compiled with Babel in a sandbox.
  **Only trusted, mentor-authored source must be served** (it runs with full
  page access).

---

## 2. Host → JSX (props)

The JSX module must `export default` a React component. It receives:

| Prop | Type | Notes |
|------|------|-------|
| `studentName` | `string` | Current student's name (fallback `"O'quvchi"`). |
| `lang` | `'uz' \| 'ru'` | UI language. |
| `tts` | `object` | Text-to-speech API (see below). The JSX must **not** build its own audio engine. |
| `files` | `object` | File helper (see below). |
| `assets` | `string` | Media-library base URL (for building media paths manually). |
| `mode` | `'answer' \| 'review'` | `answer` = first attempt; `review` = read-only re-show of a past answer. |
| `initialAnswer` | `object \| null` | The previously emitted **result object** (for re-feed / pre-fill / review). `null` on a fresh attempt. |
| `playCorrect()` | `function` | Play the host "correct" sound. |
| `playWrong()` | `function` | Play the host "wrong" sound. |
| `onReady(ready)` | `function` | Report whether the answer is filled/selected. Drives the host's **native Check button** (enabled/disabled). Call it whenever readiness changes. |
| `registerCheck(fn)` | `function` | Register the JSX's check function once. The host's native Check button calls it. `fn` must compute correctness, render feedback, and call `onSubmit(result)`. |
| `onSubmit(result)` | `function` | Emit the uniform result (section 3). Called from inside your registered check fn — not from a button inside the JSX. |

> **The check button is the platform's, not the JSX's.** The JSX must **not**
> render its own "Check" button. Instead it (1) calls `onReady(true/false)` as
> the student fills fields / picks options, and (2) registers its check via
> `registerCheck(fn)`. The host's native bottom button enables when ready, runs
> `fn` on click (→ feedback + `onSubmit`), then flips to "Next".

> **Not provided** (unlike `lesson-runner` learn lessons):
> `correctSoundUrl`, `wrongSoundUrl`, `aiGradingEndpoint`. AI grading is not
> used for test questions — the **JSX itself decides correctness**.

### Readiness + check wiring (pattern)

```jsx
// 1) report readiness whenever the answer state changes
useEffect(() => { onReady?.(value != null); }, [value, onReady]);

// 2) register the check fn (stable wrapper → always runs latest closure)
const checkRef = useRef(check);
checkRef.current = check;
useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

// 3) check computes correctness, shows feedback, then onSubmit(result)
function check() {
  const correct = /* ... */;
  setFeedback(correct);
  setChecked(true);           // optional: lock inputs after check
  onSubmit?.({ questionText, options, studentAnswer, correctAnswer, correct, meta });
}
```

### `tts` API

```js
tts.speak(text, { gender })      // play a single phrase now (gender: 'm'|'f', default 'f')
tts.play(segments)               // play a queue: [{ id, text, gender?, waits_for? }]
tts.stop()                       // stop playback
tts.replay()                     // replay previous segment
tts.triggerEvent(type, target)   // advance a segment that waits_for an event
tts.toggleMute()                 // mute / unmute
tts.isPlaying                    // boolean (reactive)
tts.muted                        // boolean (reactive)
tts.waitingFor                   // { type, target } | null (reactive)
```

`segments` item shape: `{ id: string, text: string, gender?: 'm'|'f', waits_for?: { type: string, target?: string } }`.

**TTS backend contract (v5.2):** the request is `GET ${ttsApiBase}/api/tts?text=<text>&g=<m|f>`.
`g` (gender) is the only voice control — there is **no** `lang` / `voice` / `mood` param.

- **Gender** is chosen by the **JSX itself**, per call / per segment (based on its
  own content), e.g. `tts.speak('...', { gender: 'm' })`. Default is `'f'`.
- **Language** is conveyed **inside the text** with a leading directive
  (`[O'zbekcha tallaffuz]` for uz, `[Русское произношение]` for ru). The hook
  **adds this automatically** from the question's `lang`, so the JSX passes plain
  localized text — and it is **idempotent** (never doubled if you pre-tag).
- **Emotion / prosody** directives are the author's job and pass through
  untouched: `[excited]`, `[curious]`, `[pause]`, … Put them inside `text`, e.g.
  `tts.speak('[curious] Qaysi rang issiq?')`.

### `files` API

```js
files.resolve(path)    // -> absolute media URL (absolute paths pass through)
files.upload(fileOrFiles) // -> Promise<response>; uploads file(s) for THIS question
```

### Allowed imports inside the JSX

Resolved by `src/lesson-runner/moduleRegistry.js` (anything else throws):
`react`, `react-dom`, `react-dom/client`, `react/jsx-runtime`,
`framer-motion` / `motion/react`, `lucide-react`, `recharts`, `mathjs`.

---

## 3. JSX → Host (`onSubmit(result)` — uniform result)

When the student checks their answer, the JSX calls `onSubmit(result)` exactly
once with this shape. The JSX **extracts its own question text and options** so
the answer record is self-describing for analytics:

```jsonc
{
  "questionText": "Qaysi rang issiq rang hisoblanadi?",  // extracted in-JSX question
  "options": [                                            // shown variants
    { "id": "a", "label": "🔴 Qizil" },
    { "id": "b", "label": "🔵 Ko‘k" }
  ],
  "studentAnswer": { "id": "a", "label": "🔴 Qizil" },    // any JSON structure
  "correctAnswer": { "id": "a", "label": "🔴 Qizil" },    // any JSON structure
  "correct": true,                                        // JSX's verdict (required)
  "meta": { "anything": "extra" }                         // optional
}
```

- `correct` (boolean) is **required** — it drives scoring / retry / completion.
- `studentAnswer` / `correctAnswer` / `options` may be **any JSON structure**;
  the host stores the whole object verbatim and never inspects it.

---

## 4. Host → Backend (storage)

The host serializes the result and posts it through the existing endpoint —
**no backend changes are required**:

```
POST  {VITE_API_URL}?action=question_try
Headers: X-Student-Auth: <token>
Body (JSON):
{
  "action": "question_try",
  "question_id": 12345,
  "answer": "<JSON.stringify(result)>",   // the full uniform result, stringified
  "correct": 1                            // 1 if result.correct else 0
}
```

The `answer` column already accepts a free-form string, so the entire result
object round-trips as JSON.

---

## 5. Re-feed / review

When the same question is shown again with a stored result, the host parses the
saved `answer` JSON and passes it back as `initialAnswer` (and may set
`mode: 'review'`). The JSX should:

- in `answer` mode: optionally pre-select `initialAnswer.studentAnswer`, but
  allow re-answering (used on retry);
- in `review` mode: render read-only and re-show the correct/wrong verdict from
  `initialAnswer`.

---

## 6. Host flow summary

1. `jsx-question` is filtered into `testQ` (`src/pages/Question/context.jsx`).
2. `Testing/QuestionBody.jsx` renders `<JsxQuestion>` →
   `src/pages/Question/Testing/JsxQuestion.jsx` fetches + compiles via the shared
   `src/lesson-runner/CompiledJsx.jsx` engine and supplies the props above.
3. JSX calls `onSubmit(result)` → host `handleJsxSubmit` records the attempt
   (`questionTry`) and enables the "Keyingi" button (the standard `ResultModal`
   is suppressed for this type).
4. "Keyingi" runs the normal `handleNext` → retry list / `complete_lesson`.

A working reference question lives at
`src/assets/lessons/jsx-question-example.jsx`.
