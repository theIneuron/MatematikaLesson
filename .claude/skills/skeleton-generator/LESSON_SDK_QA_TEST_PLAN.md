# Lesson Runtime SDK — QA Test Plan

> Target: JSX lessons generated with the current authoring prompt (`@lesson/runtime` SDK version).
>
> **Fundamental architecture shift vs v5.5:** the lesson no longer sees endpoints, tokens, or analytics ids. All backend plumbing (TTS, SFX, AI grading, media assets) is reached through **four SDK hooks** imported from `@lesson/runtime`. The lesson's public prop surface is exactly **three props**: `studentName`, `lang`, `onFinished`.
>
> This changes what QA tests. There's no `buildTtsUrl` to unit-test, no `assetsBase` fallback to verify, no `studentToken` to trace through the URL. Instead, testing focuses on:
> 1. **Static compliance** — the lesson uses the SDK correctly and doesn't reach around it
> 2. **Hook behavior** — each hook does what the SDK contract says
> 3. **Screen behavior** — MC, NumInput, AI-open, media rendering
> 4. **Runtime integration** — the SDK correctly bridges lesson ↔ platform

**Test asset:** any `.jsx` lesson generated with the new prompt. Reference: your latest `football-mini-lesson.jsx` (once regenerated) or a fresh `[topic]-lesson.jsx`.

---

## 0. Prerequisites

### 0.1 Environment

- [ ] `LessonRunner.jsx` mounts the lesson through `<LessonRuntimeProvider>` (the platform context that the SDK hooks read from)
- [ ] `@lesson/runtime` package installed and exports: `useAudio`, `useSfx`, `useGrader`, `useAssets`, `resolveAssetUrl` (advanced)
- [ ] TTS backend reachable via the runtime — endpoint configured in the provider, NOT in the lesson
- [ ] SFX URLs configured in the runtime provider
- [ ] AI grading endpoint configured in the runtime provider
- [ ] Media library configured in the runtime provider (base + manifest injection)
- [ ] Browser DevTools open on Network tab; filter by `tts` / `grade` / `media` as needed

### 0.2 Test data injected by LessonRuntimeProvider

The runtime provider gets:

```jsx
<LessonRuntimeProvider
  ttsApiBase="https://crm.junior-it.uz/ms/lesson-runner/api/tts?g=f"
  lessonId="football-mini-v1"
  lessonName={{ uz: 'Futbol haqida qisqacha', ru: 'Коротко о футболе' }}
  studentUuid="test-token-abc-123"
  correctSoundUrl="https://cdn.example.com/correct.mp3"
  wrongSoundUrl="https://cdn.example.com/wrong.mp3"
  aiGradingEndpoint="https://api.example.com/grade"
  assetsBase="https://crm.junior-it.uz/uploads/media_library"
  assets={{ /* mentor-uploaded manifest */ }}
  lang="uz"
>
  <FootballMiniLesson
    studentName="Sardor"
    lang="uz"
    onFinished={(p) => console.log('DONE', p)}
  />
</LessonRuntimeProvider>
```

**Critical:** the lesson component itself receives ONLY `studentName`, `lang`, `onFinished`. Everything else is context.

### 0.3 Static-analysis harness (Node.js)

Save as `qa-static.mjs` — greps the lesson file for compliance violations:

```js
import fs from 'node:fs';
const [, , file] = process.argv;
const src = fs.readFileSync(file, 'utf8');

const rules = [
  { id: 'PROPS-ONLY-THREE', pattern: /export default function \w+\(\{[^}]*\}\)/,
    check: (m) => {
      const props = m[0].match(/\{([^}]*)\}/)[1];
      const list = props.split(',').map((s) => s.trim().split('=')[0].trim()).filter(Boolean);
      const allowed = new Set(['studentName', 'lang', 'onFinished']);
      const extras = list.filter((p) => !allowed.has(p));
      return { ok: extras.length === 0, msg: extras.length ? `extra props: ${extras.join(', ')}` : 'ok' };
    } },
  { id: 'IMPORT-RUNTIME-HOOKS', pattern: /from ['"]@lesson\/runtime['"]/, must: true },
  { id: 'NO-MANUAL-BUILD-TTS', pattern: /function buildTtsUrl/, must: false },
  { id: 'NO-MANUAL-ENGINE', pattern: /createAudioEngine|audioEngine\s*=/, must: false },
  { id: 'NO-MANUAL-RESOLVE-ASSET', pattern: /function resolveAssetUrl/, must: false },
  { id: 'NO-MANUAL-GRADE-ANSWER', pattern: /function gradeAnswer|async function grade\(/, must: false },
  { id: 'NO-FETCH', pattern: /\bfetch\s*\(/, must: false },
  { id: 'NO-SPEECH-SYNTHESIS', pattern: /speechSynthesis|SpeechSynthesisUtterance/, must: false },
  { id: 'NO-SPEECH-RECOGNITION', pattern: /SpeechRecognition|webkitSpeechRecognition/, must: false },
  { id: 'NO-LOCALSTORAGE', pattern: /localStorage|sessionStorage/, must: false },
  { id: 'NO-COOKIES', pattern: /document\.cookie/, must: false },
  { id: 'NO-HARDCODED-HTTPS', pattern: /["']https?:\/\/[^"']+["']/,
    check: (m) => {
      // Only fail if https URL is in a src=, path:, or similar asset context
      const bad = src.match(/(?:src|path)\s*[:=]\s*["']https?:\/\//g) || [];
      return { ok: bad.length === 0, msg: bad.length ? `${bad.length} hardcoded URL(s) in src=/path:` : 'ok' };
    } },
  { id: 'NO-TS-SYNTAX', pattern: /:\s*(string|number|boolean|any|void)\b|\binterface\s+\w+\s*\{|^type\s+\w+\s*=/m, must: false },
  { id: 'NO-CSS-CLASSES', pattern: /className=/, must: false, softLimit: 2 /* spinner + maybe one utility */ },
  { id: 'USE-AUDIO-CALLED', pattern: /useAudio\s*\(/, must: true },
  { id: 'USE-SFX-CALLED', pattern: /useSfx\s*\(/, must: true },
  { id: 'HAS-HOST-LANG-MARKER-UZ', pattern: /\[O'zbekcha tallaffuz\]/, must: true },
  { id: 'HAS-HOST-LANG-MARKER-RU', pattern: /\[Русское произношение\]/, must: true },
  { id: 'NO-STUDENTNAME-IN-AUDIO', pattern: /audio(?:_q|_fb_correct|_fb_wrong)?:\s*[`"'][^`"']*\$\{[^}]*studentName/,
    must: false, msg: 'studentName appears inside an audio string — cache-busting violation' },
  { id: 'MIN-HEIGHT-100VH', pattern: /minHeight:\s*['"]100vh['"]/, must: false },
];

let pass = 0, fail = 0;
for (const r of rules) {
  const match = src.match(r.pattern);
  let ok, msg = 'ok';
  if (r.check) {
    const result = r.check(match || []);
    ok = result.ok; msg = result.msg;
  } else if (r.must === true) {
    ok = !!match; msg = ok ? 'found' : 'MISSING';
  } else if (r.must === false) {
    ok = !match; msg = ok ? 'not found (good)' : `FOUND: ${match?.[0]?.slice(0, 60)}`;
  } else {
    const count = (src.match(new RegExp(r.pattern, 'g')) || []).length;
    ok = count <= (r.softLimit ?? 0);
    msg = `count=${count}`;
  }
  console.log(`${ok ? '✅' : '❌'} ${r.id.padEnd(30)} ${msg}`);
  ok ? pass++ : fail++;
}
console.log(`\n${pass}/${pass + fail} rules pass`);
process.exit(fail === 0 ? 0 : 1);
```

Run: `node qa-static.mjs football-mini-lesson.jsx`. All 18 rules must pass.

### 0.4 Mock `@lesson/runtime` (for isolated unit tests)

Save as `src/test/mock-runtime.jsx` — swap in via Vite alias `@lesson/runtime` → this path for test builds:

```jsx
import { createContext, useContext, useState, useEffect, useRef } from 'react';

const RuntimeCtx = createContext(null);
export function MockRuntimeProvider({ children, overrides = {} }) {
  const value = {
    ttsCalls: [], sfxCalls: [], gradeCalls: [],
    assets: overrides.assets ?? {
      img_hook: { path: 'https://example.com/hook.png', width: 800, height: 600, aspectRatio: '4:3', description: 'test' },
    },
    ...overrides,
  };
  return <RuntimeCtx.Provider value={value}>{children}</RuntimeCtx.Provider>;
}
function useRt() { const v = useContext(RuntimeCtx); if (!v) throw new Error('MockRuntimeProvider missing'); return v; }

export function useAudio(segments) {
  const rt = useRt();
  const [state, setState] = useState({ isPlaying: false, muted: false, waitingFor: null });
  useEffect(() => { rt.ttsCalls.push({ segments, timestamp: Date.now() }); }, [segments]);
  return {
    ...state,
    triggerEvent: (type, target) => rt.ttsCalls.push({ event: type, target }),
    replay: () => rt.ttsCalls.push({ replay: true }),
    pushOneOff: (text) => rt.ttsCalls.push({ oneOff: text }),
    toggleMute: () => setState((s) => ({ ...s, muted: !s.muted })),
  };
}
export function useSfx() {
  const rt = useRt();
  return {
    playCorrect: () => rt.sfxCalls.push('correct'),
    playWrong: () => rt.sfxCalls.push('wrong'),
  };
}
export function useGrader() {
  const rt = useRt();
  return async (args) => {
    rt.gradeCalls.push(args);
    if (rt.graderShouldFail) throw new Error('mock grader fail');
    return rt.graderResponse ?? { correct: true, feedback: 'mock feedback' };
  };
}
export function useAssets() {
  const rt = useRt();
  return {
    assets: rt.assets,
    resolveUrl: (key) => {
      const a = rt.assets?.[key];
      if (!a?.path) return null;
      if (/^https?:\/\//.test(a.path)) return a.path;
      return `${rt.assetsBase || 'https://mock-cdn/'}${a.path}`;
    },
  };
}
export function resolveAssetUrl(asset, base) {
  if (!asset?.path) return null;
  if (/^https?:\/\//.test(asset.path)) return asset.path;
  return `${(base || '').replace(/\/$/, '')}/${asset.path.replace(/^\//, '')}`;
}
```

Use in tests:
```jsx
render(
  <MockRuntimeProvider overrides={{ graderResponse: { correct: false, feedback: 'bad' } }}>
    <MyLesson studentName="Sardor" lang="uz" onFinished={() => {}} />
  </MockRuntimeProvider>
);
```

---

## 1. Props contract (SDK-simplified)

### TC-001 — Lesson accepts exactly 3 props
**Precondition:** run static analyzer.

**Expected:** `PROPS-ONLY-THREE` rule passes. Signature:
```jsx
export default function LessonName({ studentName, lang = 'uz', onFinished }) { ... }
```

Any of these appearing = **FAIL**: `ttsApiBase`, `studentToken`, `correctSoundUrl`, `wrongSoundUrl`, `aiGradingEndpoint`, `assets`, `assetsBase`, `voiceGender`, `ttsExtras`.

- [ ] Pass  - [ ] Fail

---

### TC-002 — Lesson works when only `studentName` + `onFinished` provided
**Precondition:** `lang` defaults to `'uz'`.

**Steps:**
```jsx
<MockRuntimeProvider>
  <MyLesson studentName="Sardor" onFinished={() => {}} />
</MockRuntimeProvider>
```

**Expected:** renders Screen 0, text is Uzbek, no crash.

- [ ] Pass  - [ ] Fail

---

### TC-003 — `lang='ru'` switches all UI to Russian
**Expected:** hook title/sub/opts/kicker + every visible string is Russian. Audio segments start with `[Русское произношение]`.

- [ ] Pass  - [ ] Fail

---

### TC-004 — `studentName` visible in ≥3 places
**Steps:** full lesson pass, grep DOM for `Sardor`.

**Expected:** at least 3 occurrences (hook title, mid-lesson kicker/reference, result hero).

- [ ] Pass  - [ ] Fail

---

### TC-005 — `studentName` NEVER in audio
**Static check:** `NO-STUDENTNAME-IN-AUDIO` rule passes.

**Runtime check:** capture all `rt.ttsCalls` from mock — none of the `segments[].text` should contain `Sardor`.

- [ ] Static pass  - [ ] Runtime pass

---

### TC-006 — `onFinished` called exactly once
**Steps:** finish full lesson, click "Darsni tugatish" once, then twice quickly.

**Expected:**
- Callback fires only on first click
- Log the callback → assert `callCount === 1` after full flow
- No error on double-click

- [ ] Pass  - [ ] Fail

---

## 2. `useAudio` hook usage

### TC-007 — Every screen calls `useAudio`
**Static check:** count `useAudio(` occurrences.

**Expected:** ≥ N-1 where N is the number of screens (all except maybe the result). Result screen should also call it — verify.

- [ ] Pass  - [ ] Fail

---

### TC-008 — First segment on each screen has `trigger: 'on_mount'`
**Static regex:**
```
useMemo\(\s*\(\)\s*=>\s*\[\s*\{[^}]*trigger:\s*['"]on_mount['"]
```

Should match once per screen using `useAudio`.

- [ ] Pass  - [ ] Fail

---

### TC-009 — Multi-step audio uses `after_previous`
**Static check:** in screens with narrated steps (analysis, full-analysis), segment array should have `after_previous` triggers for non-first entries.

**Runtime check:** mount an analysis screen through mock runtime → advance step → verify `rt.ttsCalls` shows sequential segment loads.

- [ ] Pass  - [ ] Fail

---

### TC-010 — `waits_for` events match `triggerEvent` calls
**Steps:**
1. Grep every `waits_for: { type: 'X' }` — collect X values
2. Grep every `audio.triggerEvent('X', ...)` — collect X values
3. Sets should overlap

**Expected:** every `waits_for` type has a matching `triggerEvent` call somewhere. Extra `triggerEvent` calls are OK (defensive). Extra `waits_for` types with no fire = **stuck audio** = **FAIL**.

- [ ] Pass  - [ ] Fail

---

### TC-011 — MC screen: `pushOneOff` fires ~400ms after answer
**Runtime check (with mock):**
```jsx
render(<MockRuntimeProvider><MCScreen ... /></MockRuntimeProvider>);
click(optionA);
await sleep(500);
expect(rt.ttsCalls.filter((c) => c.oneOff)).toHaveLength(1);
```

- [ ] Pass  - [ ] Fail

---

### TC-012 — Every audio string starts with host-lang marker
**Static check:** grep all lines matching `audio[a-z_]*:\s*[`"]`.

Every match should start with either `[O'zbekcha tallaffuz]` or `[Русское произношение]` (as the first bracketed thing after the opening quote — expressive tags come *after*).

**Regex to validate:**
```
audio(_q|_fb_correct|_fb_wrong)?:\s*[`"']\[(O'zbekcha tallaffuz|Русское произношение)\]
```

Every audio field must match. Any that don't = **FAIL** (ElevenLabs v3 will mispronounce).

- [ ] Pass  - [ ] Fail

---

### TC-013 — Expressive tags: 0–2 per segment, no adjacent tags, no invented tags
**Allowed:** `[laughs]`, `[laughs harder]`, `[starts laughing]`, `[chuckle]`, `[giggle]`, `[whispers]`, `[sighs]`, `[gasps]`, `[clears throat]`, `[pause]`, `[long pause]`, `[excited]`, `[curious]`, `[sarcastic]`, `[mischievously]`.

**Static rules:**
- Per audio string: count bracketed tags after the host marker → ≤ 2
- No adjacent `][` bracketed tags: `][.*?][` inside one string is FAIL
- No unknown tags: grep bracketed lowercase words → compare against whitelist

**Grep suggestion:**
```bash
node qa-static.mjs football-mini-lesson.jsx | grep -A2 EXPRESSIVE
```

- [ ] Pass  - [ ] Fail

---

### TC-014 — Multilingual insertions use `[language: X] ... [end]` or `[English pronunciation] ... [end]`
**Static check:** if the lesson teaches a foreign language, look for these markers. If present, every opening bracket has a matching `[end]` (unless at segment tail).

- [ ] Pass  - [ ] Fail

---

### TC-015 — No banned math symbols in audio
Symbols to grep inside `audio*:` strings: `%`, `/`, `²`, `+`, `=`, `×`.

**Exception:** fractions like `1/3` → must be transformed to words in `pushOneOff` (see the MCScreen template):
```js
fb.replace(/(\d+)\/(\d+)/g, (_, n, d) => (lang === 'ru' ? `${n} на ${d}` : `${n} bo'lingan ${d}`))
```

- [ ] No raw symbols in `audio_q`, `audio`, `audio_fb_*` fields
- [ ] Fraction-to-word transformer applied in MCScreen where fractions appear

---

## 3. `useSfx` hook usage

### TC-016 — SFX only on scored answers
**Static grep:** every `sfx.playCorrect()` / `sfx.playWrong()` occurrence should be inside `MCScreen`, NumInput screen, or `OpenQuestionScreen`. Never inside hook, analysis, concept, rule, full-analysis, case-start.

- [ ] Pass  - [ ] Fail

---

### TC-017 — SFX fires exactly once per reveal
**Runtime check:**
```jsx
click(correctOption);
expect(rt.sfxCalls).toEqual(['correct']);
click(correctOption); // guarded by `revealed` — should be no-op
expect(rt.sfxCalls).toEqual(['correct']); // still just one
```

- [ ] Pass  - [ ] Fail

---

### TC-018 — SFX failure doesn't crash the lesson
**Precondition:** override mock:
```js
useSfx: () => ({ playCorrect: () => { throw new Error('mock sfx fail'); }, playWrong: () => {} }),
```

**Expected:** MC answer still records, feedback still shows, no error boundary triggers. (Note: the SDK should catch inside, so lesson code doesn't need try/catch.)

- [ ] Pass  - [ ] Fail

---

## 4. `useGrader` hook usage

### TC-019 — Lesson has 1–2 AI-open screens, never at final index
**Static check:**
- Count `<OpenQuestionScreen` occurrences → 1 or 2
- Verify the screenIdx used is NOT `totalScreens - 2` (final test position — usually second-to-last)
- The final test screen must be deterministic (`MCScreen` or NumInput)

- [ ] Pass  - [ ] Fail

---

### TC-020 — Grader called with correct shape
**Runtime check:**
```js
const call = rt.gradeCalls[0];
expect(call).toMatchObject({
  screenIdx: expect.any(Number),
  question: expect.any(String),
  rubric: expect.any(String),
  mode: expect.stringMatching(/^(text|voice)$/),
});
if (call.mode === 'text') expect(call.answerText).toBeTruthy();
if (call.mode === 'voice') expect(call.audioBlob).toBeInstanceOf(Blob);
```

Notice what's NOT there: `lessonId`, `lang`, `endpoint`. Those are injected by the SDK.

- [ ] Pass  - [ ] Fail

---

### TC-021 — Grader failure records `correct: null` and lets student advance
**Precondition:** mock `graderShouldFail = true`.

**Expected:**
- No exception bubbles up
- Answer stored with `correct: null`
- Soft error message shown to student
- Next button becomes enabled (or student can navigate away)
- `onFinished.answers` filters out this screen from scoring

- [ ] Pass  - [ ] Fail

---

### TC-022 — Voice mode: WebM blob sent, not text transcript
**Precondition:** voice-mode AI screen.

**Steps:**
1. Grant mic permission in browser
2. Record 3 seconds
3. Submit

**Expected:**
- `gradeCalls[0].mode === 'voice'`
- `gradeCalls[0].audioBlob instanceof Blob` (WebM/Opus)
- `gradeCalls[0].audioBlob.type` starts with `audio/`
- NO client-side transcription (grep code: `SpeechRecognition` should not appear)

- [ ] Pass  - [ ] Fail

---

### TC-023 — Voice mode: mic permission denial handled gracefully
**Precondition:** deny mic access.

**Expected:**
- `VoiceRecorder` shows the "not allowed" red message
- No unhandled error
- Student can still navigate (though they can't submit without a recording)

- [ ] Pass  - [ ] Fail

---

### TC-024 — Voice mode: transcript displayed in feedback if server returns one
**Precondition:** mock `graderResponse = { correct: true, feedback: 'Great', transcript: 'I like football' }`.

**Expected:** feedback block shows both `feedback` and (italicized quote) `"I like football"`.

- [ ] Pass  - [ ] Fail

---

## 5. `useAssets` hook usage

### TC-025 — `resolveUrl(key)` called instead of manual concatenation
**Static check:** no `assetsBase + path` or template-literal concat. Only `resolveUrl('...')` calls.

- [ ] Pass  - [ ] Fail

---

### TC-026 — Missing asset → `resolveUrl` returns `null` → conditional render skips
**Precondition:** `MockRuntimeProvider overrides={{ assets: {} }}`.

**Expected:**
- `resolveUrl('img_hook')` returns `null`
- The `<img>` is NOT rendered (conditional `{url && <img />}` guards it)
- Lesson still works — SVG fallback (if any) shows, or screen just has no image
- No `src=""` empty attribute, no broken image icon

- [ ] Pass  - [ ] Fail

---

### TC-027 — Only manifest keys are referenced
**Static check:** grep every `resolveUrl('X')` and `assets.X` → all X should appear in the "Available assets" block the mentor provides.

If the mentor's manifest has `[img_hook, vid_intro]` but the lesson code references `assets.img_outro`, that's a **FAIL** (invented key).

- [ ] Pass  - [ ] Fail

---

### TC-028 — `width`, `height`, `aspectRatio` used to prevent layout shift
**Static check:** every `<img>` / `<video>` using `resolveUrl` should have inline style with `aspectRatio` or width+height passed.

**Runtime check:** DevTools Performance tab → run lesson → CLS (Cumulative Layout Shift) score < 0.1.

- [ ] Pass  - [ ] Fail

---

### TC-029 — `<img alt>` uses `assets.X.description`
**Static check:** `alt={assets.X?.description}` pattern present. No `alt=""` on manifest images.

- [ ] Pass  - [ ] Fail

---

## 6. Screen behavior

### TC-030 — Every screen fits within 100vh (no page scroll)
**Steps:** open each screen at 1920×1080, 1366×768, and 360×640 (Chrome DevTools device mode).

**Expected:**
- `document.documentElement.scrollHeight === document.documentElement.clientHeight` (no vertical scroll)
- **Exception:** the result screen's mistakes list may scroll internally, but the page still doesn't

- [ ] Desktop  - [ ] Tablet  - [ ] Mobile 360px

---

### TC-031 — Back button restores previous state
**Steps:**
1. Screen 3 (MC): tap wrong option → verify feedback shown
2. Next → Screen 4
3. Back → Screen 3

**Expected:** wrong option still highlighted red, correct option still highlighted green, feedback still visible. State restored from `storedAnswer`.

- [ ] Pass  - [ ] Fail

---

### TC-032 — Answer state stays in `useState`, not localStorage
**Static check:** `NO-LOCALSTORAGE` rule.

**Runtime check:** after full lesson, DevTools → Application → Local Storage should be empty for the lesson's origin.

- [ ] Pass  - [ ] Fail

---

### TC-033 — Hook screen records `{ picked, type: 'hook' }` with no `correct` field
Grep `S0_Hook` code → `onAnswer(screenIdx, { picked: i, type: 'hook' })` — verify no `correct:` field.

- [ ] Pass  - [ ] Fail

---

### TC-034 — Per-option wrong feedback on every MC
For every MC screen: verify `wrong_0`, `wrong_1`, `wrong_2`, `wrong_3` all defined in CONTENT (for opts of length 4). None should fall back to the generic "Noto'g'ri" string.

- [ ] Pass  - [ ] Fail

---

## 7. `onFinished` payload

### TC-035 — Payload shape
```js
{
  lessonId: string,
  lessonTitle: string,          // lang-specific
  durationSec: number,           // integer, reasonable
  totalQuestions: number,
  correctAnswers: number,        // AI failures (null) NOT counted
  scorePercent: number,          // 0-100
  passed: boolean,               // correct >= total * 0.6
  answers: Array<{
    questionIndex: number,
    type: string,
    question: string,
    correct: boolean | null,
    // ... additional fields
  }>,
}
```

- [ ] All keys present  - [ ] Types correct  - [ ] `correctAnswers` excludes `correct: null`

---

### TC-036 — Payload does NOT contain `studentToken` / URLs / any secrets
Grep payload JSON:
- No `token`, `uuid`, `endpoint`, `apiBase`, `secret`
- No `https://` URLs (except possibly `lessonTitle` if the mentor put one there, but shouldn't)

- [ ] Pass  - [ ] Fail

---

### TC-037 — Passing threshold: 60%
Deliberately answer `⌈total*0.6⌉` correctly. Verify `passed === true`.
Answer one fewer. Verify `passed === false`.

- [ ] Pass  - [ ] Fail

---

## 8. Anti-pattern static matrix

Run `qa-static.mjs` and tick each rule:

| Rule ID                       | What it catches                                                        | Status |
|-------------------------------|------------------------------------------------------------------------|--------|
| `PROPS-ONLY-THREE`            | Extra props on default export                                          | [ ]    |
| `IMPORT-RUNTIME-HOOKS`        | Missing `@lesson/runtime` import                                       | [ ]    |
| `NO-MANUAL-BUILD-TTS`         | Hand-rolled `buildTtsUrl` (should use SDK)                             | [ ]    |
| `NO-MANUAL-ENGINE`            | Hand-rolled audio engine (should use SDK)                              | [ ]    |
| `NO-MANUAL-RESOLVE-ASSET`     | Re-defined `resolveAssetUrl` (should use SDK export)                   | [ ]    |
| `NO-MANUAL-GRADE-ANSWER`      | Hand-rolled `gradeAnswer` (should use SDK)                             | [ ]    |
| `NO-FETCH`                    | Any `fetch()` call in the lesson                                       | [ ]    |
| `NO-SPEECH-SYNTHESIS`         | `window.speechSynthesis` used                                          | [ ]    |
| `NO-SPEECH-RECOGNITION`       | Browser STT used                                                       | [ ]    |
| `NO-LOCALSTORAGE`             | `localStorage`/`sessionStorage`                                        | [ ]    |
| `NO-COOKIES`                  | `document.cookie`                                                      | [ ]    |
| `NO-HARDCODED-HTTPS`          | Full URLs in `src=` / `path:` (should go through `useAssets`)          | [ ]    |
| `NO-TS-SYNTAX`                | TypeScript type annotations                                            | [ ]    |
| `NO-CSS-CLASSES`              | `className=` beyond spinner exception                                  | [ ]    |
| `USE-AUDIO-CALLED`            | `useAudio()` used at least once                                        | [ ]    |
| `USE-SFX-CALLED`              | `useSfx()` used at least once                                          | [ ]    |
| `HAS-HOST-LANG-MARKER-UZ`     | `[O'zbekcha tallaffuz]` present in audio                               | [ ]    |
| `HAS-HOST-LANG-MARKER-RU`     | `[Русское произношение]` present in audio                              | [ ]    |
| `NO-STUDENTNAME-IN-AUDIO`     | `${studentName}` template inside `audio*:` strings                     | [ ]    |
| `MIN-HEIGHT-100VH`            | `minHeight: '100vh'` (should be `height: '100vh'`)                     | [ ]    |

---

## 9. Runtime integration (real SDK, real backend)

### TC-038 — SDK context propagates all backend endpoints
Load a full end-to-end setup (real `LessonRuntimeProvider` + real backend). Verify:
- TTS network requests fire from within the SDK, NOT from lesson code (stack trace)
- Grading POSTs fire from within the SDK
- Image URLs constructed by SDK's `resolveUrl`

Confirm by DevTools Network → Initiator column → should point to `@lesson/runtime` module, not the lesson `.jsx`.

- [ ] Pass  - [ ] Fail

---

### TC-039 — TTS analytics params still sent (via SDK)
Even though the lesson doesn't build the URL, the SDK should. Check TTS request URL — should have `lesson_id`, `lesson_name`, `student_uuid` from the provider config.

- [ ] Pass  - [ ] Fail

---

### TC-040 — Two students share TTS cache for same audio text
Same as v5.5 TC-012 — cache separation of `student_uuid` param. Verified server-side, not lesson-side.

- [ ] Pass  - [ ] Fail

---

## 10. Cross-browser smoke

| Browser              | TC-001–005 | TC-011 | TC-022 (voice) | TC-030 (100vh) |
|----------------------|-----------|--------|----------------|----------------|
| Chrome latest        | [ ]       | [ ]    | [ ]            | [ ]            |
| Firefox latest       | [ ]       | [ ]    | [ ]            | [ ]            |
| Safari macOS         | [ ]       | [ ]    | [ ]            | [ ]            |
| Safari iOS           | [ ]       | [ ]    | [ ]            | [ ]            |
| Chrome Android       | [ ]       | [ ]    | [ ]            | [ ]            |

**Safari note:** MediaRecorder outputs `audio/mp4` (not WebM) — verify SDK handles both. VoiceRecorder code already checks: `MediaRecorder.isTypeSupported(...)`.

---

## 11. Sign-off

- [ ] `qa-static.mjs` runs clean (18/18 rules)
- [ ] All TC-* pass
- [ ] Regression matrix (§8) 100% green
- [ ] Cross-browser smoke passes
- [ ] Voice mode tested end-to-end (mic → blob → grader → transcript display)
- [ ] Runtime integration: SDK is the only network initiator

**Tester:** __________________
**Date:** __________________
**Lesson tested:** __________________ @ commit __________
**SDK version:** `@lesson/runtime@_______`
**Prompt version:** SDK-based (post-v5.5)

---

## Appendix A — Migration checklist (if you have v5.5 lessons to convert)

Convert an old prop-based lesson to the SDK version:

| v5.5 lesson code                            | SDK equivalent                                       |
|---------------------------------------------|------------------------------------------------------|
| `function buildTtsUrl(...)`                 | delete                                               |
| `let audioEngine = null; ...`               | delete                                               |
| `function useAudio(segs, base, extras) {}`  | `import { useAudio } from '@lesson/runtime'`         |
| `function useSfx(correct, wrong) {}`        | `import { useSfx } from '@lesson/runtime'`           |
| `function gradeAnswer({endpoint, ...})`     | `import { useGrader } from '@lesson/runtime'`        |
| `function resolveAssetUrl(a, b)`            | `import { useAssets } from '@lesson/runtime'` (or `resolveAssetUrl` for edge cases) |
| `DEFAULT_ASSETS`, `DEFAULT_ASSETS_BASE`     | delete — provider handles defaults                   |
| `LESSON_NAME = { uz, ru }` constant         | delete — provider handles                            |
| `ttsExtras = useMemo(...)`                  | delete                                               |
| Props: `ttsApiBase, studentToken, correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, assets, assetsBase` | delete from signature                                 |
| Screen destructure: `ttsApiBase, ttsExtras, sfx, assets, assetsBase` | delete — screens call hooks themselves               |
| `common` object                             | trim to `{ screenIdx, lang, studentName, progress, totalScreens, storedAnswer, onAnswer, onNext, onBack }` |

Then run `qa-static.mjs` — if it passes, migration is complete.

---

## Appendix B — Suggested test infrastructure

For a Node.js e2e architect, recommended setup:

```
package.json scripts:
  "test:static": "node qa-static.mjs lessons/*.jsx"
  "test:unit":   "vitest run"
  "test:e2e":    "playwright test"

vitest.config.js:
  resolve.alias['@lesson/runtime'] = './src/test/mock-runtime.jsx'

CI pipeline (per lesson PR):
  1. lint (eslint)
  2. test:static (all rules pass)
  3. test:unit (mock SDK tests — screen behavior, audio flow, MC feedback)
  4. test:e2e (Playwright: full lesson pass in real browser, real backend)
```

Static check on every commit is the highest-ROI test: it's fast (< 1 second per lesson) and catches 80% of contract violations before they reach a reviewer.

---

## Appendix C — Common regressions to watch for

Bugs that have historically slipped past code review, worth explicit checks:

1. **`studentName` in audio via template literal** — TC-005. Break the cache silently.
2. **Missing host-lang marker** — TC-012. ElevenLabs pronounces "Hisoblang" as English word.
3. **AI screen at final index** — TC-019. Non-deterministic grading → student can be blocked from finishing.
4. **`sfx.playCorrect()` in a `useEffect` without guard** — TC-017. Fires twice on remount.
5. **`resolveUrl` returning `null` handled by rendering `<img src={null} />`** — TC-026. Broken image icon.
6. **`useAudio(segments)` where `segments` isn't memoized** — every render reloads the queue, audio stutters. Verify `useMemo` around every `audioSegs` definition.
7. **Voice recorder timer not cleared on unmount** — memory leak. Check `useEffect` cleanup.
8. **onFinished called from a `useEffect` with dependency array that mutates** — fires multiple times. TC-006.
