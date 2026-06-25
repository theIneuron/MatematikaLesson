# Lesson Authoring Prompt v5.5-male — default voice = male (TTS URL contract fixed)

> **Отличие от канонического v5.5:** единственное изменение — **дефолтный голос мужской** (`g=m`).
> Везде, где было `default 'f'`, теперь `default 'm'`. Поэкранный выбор не изменился: любой
> экран можно озвучить женским через `voice: 'f'` в `CONTENT.sN`, отдельный сегмент — через
> поле `gender: 'f'`. Контракт TTS-URL, языковые маркеры и всё остальное идентично v5.5.


> Mentor bu prompt'ni Claude'ga beradi va o'rniga yangi `.jsx` dars oladi.
> **v4'dan farqi:**
> - **SFX (sound effects)** — to'g'ri/noto'g'ri javoblar uchun ikki audio fayl `correctSoundUrl` / `wrongSoundUrl` prop'lari orqali. Lesson SFX ni avtomatik javobdan keyin chaladi
> - **AI-graded ochiq savollar** — yangi screen turi `OpenQuestionScreen`. O'quvchi ochiq matn yoki ovozli xabar yuboradi, AI server javobni baholaydi va shaxsiy feedback qaytaradi
> - **Ikki rejim per savol** — har bir AI savolda **YOKI** matn input **YOKI** ovoz input — ikkalasi birdaniga emas. Dars yaratilayotganda Claude qaysi rejimni tanlasa, shu ishlatiladi (`mode: 'text' | 'voice'`)
> - **AI grading endpoint** — `aiGradingEndpoint` prop'i orqali, `POST` so'rov yuboriladi va `{ correct, feedback, transcript? }` qaytadi
> - Tayyor yangi komponentlar: `useSfx` hook, `OpenQuestionScreen`, `VoiceRecorder`, `gradeAnswer` helper
>
> **v5.1 da qo'shilgan (ElevenLabs):**
> - **Audio tags** — `[chuckle]`, `[pause]`, `[whispers]`, `[laughs]`, `[gasps]`, va boshqalar — narratsiyani jonli qilish uchun. Cheklovsiz ishlatilmaydi (0-2 ta segmentga)
> - **Multilingual markerlar** — `[English pronunciation] hello [end]` ko'rinishida. Til o'rgatish darslari uchun: o'zbek/rus narratsiyasi ichida ingliz so'zlari to'g'ri talaffuz bilan o'qiladi
>
> **v5.2 da o'zgardi (soddalashtirilgan TTS API):**
> - TTS endpoint endi **faqat ikki parametr** oladi: `text` va `g` (gender: `f` yoki `m`)
> - `lang`, `voice`, `mood`, `provider` parametrlari **olib tashlandi**
> - Til endi matn ichidagi marker'lar orqali aniqlanadi (`[O'zbekcha talaffuz]`, `[Русское произношение]`, `[English pronunciation] ... [end]`)
>
> **v5.3 da qo'shilgan (media assets):**
> - **Mentor rasm/video/audio yuklay oladi** — har biri uchun key, fayl nomi, o'lcham, tavsif (≤10 so'z) saqlanadi
> - Lesson JSX kodi URL'larni **bilmaydi** — faqat key'lar va metadata bilan ishlaydi (`assets.img_hook`, `assets.vid_intro`)
> - Yangi 2 ta prop: **`assets: object`** (manifest) va **`assetsBase: string`** (provider base URL)
> - URL runtime'da quriladi: `assetsBase + asset.path`. Agar `path` `https://` bilan boshlansa — bypass (tashqi CDN passthrough)
> - Key prefix konvensiyasi: `img_` (rasm), `vid_` (video), `aud_` (audio clip)
> - `resolveAssetUrl(asset, base)` helper'i orqali ishlatiladi — qo'lda string concatenation taqiqlanadi
> - Mentor `USE ON: sN` belgisi bilan asset'ni aniq ekranga "pin" qila oladi yoki Claude'ga ixtiyor beradi
>
> **v5.4 (bekor qilindi):** "gender'ni `ttsApiBase` ichiga ko'chirish" g'oyasi platformaga mos kelmadi. Platform `ttsApiBase`'ga **faqat baza URL** (`https://crm.junior-it.uz/ms/lesson-runner`) beradi — `/api/tts` yo'li ham, `?g=` ham yo'q. v5.4 promptidan yasalgan dars `https://crm.junior-it.uz/ms/lesson-runner?text=...` so'rovini yuborgan → `/api/tts` yo'qligi sbabli **CORS / 404**. v5.5 buni tuzatadi.
>
> **v5.5 da tuzatildi (TTS URL kontrakti — kodga moslashtirildi):**
> - `ttsApiBase` endi **baza URL** (masalan `https://crm.junior-it.uz/ms/lesson-runner`) — `/api/tts` ham, query ham YO'Q. Bularni **lesson o'zi quradi**.
> - `buildTtsUrl(base, text, gender)` endi to'liq URL'ni quradi: `` `${base}/api/tts?text=...&g=...` ``
> - Server **faqat ikki parametr** oladi: `text` va `g` (gender: `f` yoki `m`). `lang`, `voice`, `mood`, `provider` — YO'Q (til matn ichidagi marker'lardan aniqlanadi)
> - Gender **prop EMAS** — u **dars ichida**, har bir ekran uchun alohida (per-screen dinamik) tanlanadi: `CONTENT`'dagi ixtiyoriy `voice: 'f' | 'm'` maydoni orqali (default `'m'`), va `g` query param sifatida yuboriladi. Platform gender bermaydi — darsning o'zi hal qiladi (bir personaj erkak, boshqasi ayol ovoz bo'lishi mumkin).
> - `useAudio(segments, voiceGender, ttsApiBase)` — yana 3 argument (`voiceGender` har ekran o'zi beradi, masalan `c.voice || 'm'`)
> - Audio engine'da `setBase` (oxirgi `/` ni tozalaydi) va `setGender` method'lari bor; segment'da ixtiyoriy `gender` maydoni ekran default'ini bekor qila oladi (per-segment)
> - Bu aynan junior-frontend'dagi shipped darslar (`football-mini-lesson.jsx`) ishlatadigan kontrakt — prompt endi kod bilan bir xil
>
> **v5.5 — ElevenLabs v3 til markerlari (uz / ru / en):**
> - TTS endi **ElevenLabs v3**. v3 har bir til bo'lagini **aniq marker** bilan belgilaganда eng toza talaffuz beradi (ayniqsa o'zbek tili uchun — aks holda rus/turk fonetikasiga "siljib" ketishi mumkin).
> - Uchta marker, har biri `[end]` bilan yopiladi: **`[O'zbekcha talaffuz]`**, **`[Русское произношение]`**, **`[English pronunciation]`**.
> - **Har bir audio matnini host til markeri bilan boshlang**: `uz` audio `[O'zbekcha talaffuz]` bilan, `ru` audio `[Русское произношение]` bilan. Ichidagi inglizcha bo'laklar `[English pronunciation] ... [end]`.
> - Dars asosan **uch tilda** ishlaydi: o'zbek, rus, ingliz.
>
> - v4 ning hammasi saqlangan: screen-based, storedAnswer, per-option MC feedback, studentName visible-only

---

## Mentor uchun foydalanish

1. Pastdagi prompt'ni nusxalang
2. `[REPLACE: ...]` joylarni o'z mavzungiz bilan to'ldiring
3. Claude'ga (Sonnet 4 yoki Opus 4+) yuboring
4. Javob — bitta `.jsx` fayl (~1500-2700 satr)
5. Admin panel'da preview qiling, ishlasa publish bosing

**Runtime talablar:**
- **TTS server** (`ttsApiBase`) — narratsiya uchun, ishlamasa dars audio'siz davom etadi. Platform **baza URL'ni** beradi (NO `/api/tts`, NO query). Misol: `https://crm.junior-it.uz/ms/lesson-runner`. Lesson o'zi `/api/tts?text=...&g=...` ni quradi. Gender dars ichida, per-screen tanlanadi (`CONTENT.voice`, default `'m'`) — prop emas
- **SFX URL'lar** (`correctSoundUrl`, `wrongSoundUrl`) — to'g'ri/noto'g'ri javob tovushlari, qisqa (<1s) mp3/wav fayllar (platforma CDN'iga joylash mumkin)
- **AI grading endpoint** (`aiGradingEndpoint`) — agar darsda AI-graded savol bo'lsa kerak. Ishlamasa AI savollar skip bo'ladi va dars davom etadi
- **Media assets** (`assets` manifest + `assetsBase`) — mentor rasm/video/audio yuklasa kerak. `assetsBase` misol: `'https://qa-crm.junior-it.uz/uploads/media_library'`. Ikkalasi ham yo'q bo'lsa, lesson SVG fallback'lar bilan ishlaydi
- AI grading endpoint shape — quyida §"AI-graded open questions" bo'limida to'liq batafsil
- Media assets shape — quyida §"Media assets" bo'limida to'liq batafsil

---

## PROMPT START

You will write a complete lesson as a single `.jsx` file for our math/science learning platform. **The layout is video-style** — full viewport, cinematic, screen-based. Visual content (SVG + typographic elements) is the protagonist, text is the caption. Audio narration plays via a dedicated TTS HTTP API; short SFX (correct/wrong) play on scored answers via two URL props. Some questions are open-ended and graded by an AI server you POST to with text or voice — see below.

### Topic and audience

- **Topic:** `[REPLACE: e.g. "Kvadrat tenglamalar" / "Pifagor teoremasi" / "Vektorlar"]`
- **Grade level:** `[REPLACE: e.g. 5-sinf / 7-8 sinf / 9-10 sinf]`
- **Duration:** `[REPLACE: e.g. 12-18 minut]`
- **Tone:** clear, engaging, age-appropriate. Use the student's name often.

### Hard contract (do not deviate)

```jsx
export default function LessonName({
  studentName, lang, ttsApiBase,
  correctSoundUrl, wrongSoundUrl,
  aiGradingEndpoint,
  assets, assetsBase,
  onFinished,
}) { ... }
```

**Props:**
- `studentName: string` — **for visible text only** (hook title, mid-lesson kicker, result hero). Never include it in audio scripts — that would bust the TTS cache per student. Always fallback: `studentName || (lang === 'ru' ? 'Ученик' : "O'quvchi")`
- `lang: 'uz' | 'ru'` — bilingual. Used only for **content selection** (`CONTENT.uz` vs `CONTENT.ru`) and UI strings. **Not** sent to the TTS server — the audio engine reads the language from inline markers within each audio string. Use a helper at the top: `const t = (uz, ru) => lang === 'ru' ? ru : uz;`
- `ttsApiBase: string` — **base URL of the TTS service**, e.g. `'https://crm.junior-it.uz/ms/lesson-runner'`. It is **NOT** the full endpoint: it has no `/api/tts` path and no query string. The lesson builds the real request itself via `buildTtsUrl` → `` `${base}/api/tts?text=<encoded>&g=<gender>` ``. If absent or undefined, audio is silently disabled. **Never** append `?text=` directly to this base — that omits the `/api/tts` path and the server rejects it (CORS / 404).
  - **Voice gender is NOT a prop.** The platform never passes it. The lesson decides the `g` value itself, **per screen**, via an optional `voice: 'f' | 'm'` field in `CONTENT` (default `'m'`) — see §"TTS HTTP API" and §"CONTENT object structure". This lets one lesson voice different characters (e.g. `voice: 'f'` on a screen narrated by a female character).
- `correctSoundUrl: string` — fully-qualified URL of the "correct answer" SFX file (mp3/wav/ogg). Played once whenever a scored question is answered correctly. If absent, silent fallback.
- `wrongSoundUrl: string` — same shape, played on a wrong scored answer. SFX never plays for the hook screen (which has no right/wrong).
- `aiGradingEndpoint: string` — full URL of the AI grading endpoint, e.g. `'https://api.example.com/grade'`. Used by `OpenQuestionScreen` (see §"AI-graded open questions" below). If absent, AI-graded screens auto-skip with a noop result.
- `assets: object` — **optional** runtime override of the media manifest. In production it is `undefined` — the platform does **not** deliver a manifest. The lesson defines its own manifest as a `DEFAULT_ASSETS` constant in the `.jsx` and merges this prop on top (`{ ...DEFAULT_ASSETS, ...(assets || {}) }`). See §"Media assets" below.
- `assetsBase: string` — fully-qualified base URL of the media file provider (e.g. `'https://crm.junior-it.uz/uploads/media_library'`), supplied by the platform. Combined with each asset's `path` at runtime to form the src URL. If a `path` already starts with `https://`, the base is ignored (absolute-URL passthrough).
- `onFinished: (result) => void` — call **exactly once**, from the final result screen, with the full payload (see §"onFinished payload")

### Available imports — use only these

```jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Check, X, Play, Award, Sparkles,
  Volume1, Volume2, VolumeX, RotateCcw, Lightbulb,
  Mic, MicOff, Square, Send, Loader2,
  /* any lucide-react icon you need */
} from 'lucide-react';
// Optional:
// import { evaluate, parse } from 'mathjs';
```

No external audio library, no audio files (the SFX URLs are passed in via props), no fetch wrappers other than `gradeAnswer` (see below) — just the helpers below.

---

## TTS HTTP API (audio narration)

Audio narration is generated by a backend TTS server backed by **ElevenLabs v3** (streaming audio). The lesson **never** uses `window.speechSynthesis` — that is banned. The **base URL** is **passed in via the `ttsApiBase` prop** — not hardcoded — so the same lesson runs against dev / staging / prod without source changes.

### Endpoint

The platform provides only the **base URL** in `ttsApiBase` — no path, no query:

```
ttsApiBase = 'https://crm.junior-it.uz/ms/lesson-runner'
```

The lesson builds the actual request itself by **appending the `/api/tts` path** plus the two query params:

```
https://crm.junior-it.uz/ms/lesson-runner/api/tts?text=<encoded sentence>&g=<f|m>
```

This is done in `buildTtsUrl` (below). **Critical:** never send `text` straight against `ttsApiBase` (`…/ms/lesson-runner?text=…`) — without the `/api/tts` path the server rejects it with a **CORS / 404** error. The `/api/tts` path is the lesson's responsibility.

| Param  | Type    | Source                  | Notes                                                                                       |
|--------|---------|-------------------------|---------------------------------------------------------------------------------------------|
| `text` | string  | **lesson adds this**    | URL-encoded; max 1000 chars; **MUST be wrapped in explicit language markers** (`[O'zbekcha talaffuz]`, `[Русское произношение]`, `[English pronunciation] ... [end]`) — ElevenLabs v3 reads the language from these. Open with the host-language marker; see §"Language markers" |
| `g`    | `f`/`m` | **lesson adds this**    | Voice gender (`f` female, `m` male). Chosen **inside the lesson, per screen** — from `CONTENT[lang].sN.voice` (default `'m'`). Not a prop, not in the base URL. |

That is the **entire** query surface — only `text` and `g`. The server does **not** accept `lang`, `voice`, `mood`, or `provider`; language comes from the inline markers in `text`, and voice/mood come from ElevenLabs tags inside `text`. Don't send them.

Response: streamed audio. Cache key on the server includes the gender + text (`sha256(g|normalize(text))`). **Audio scripts must NEVER contain the student's name** — every unique student would otherwise produce a unique cache key and force a fresh ElevenLabs call.

**Lesson must use `<Audio>` element / `new Audio()`** with the URL — no `fetch()`, no MediaSource. The browser progressively decodes the stream natively. No CORS issues for `<audio>`.

If `ttsApiBase` is `undefined`/empty, the engine simply does not play anything — every other lesson interaction must still work.

### Required audio engine + `useAudio` hook (use verbatim)

Paste this block near the top of your file (after the color/font constants, before any screen components):

```jsx
// ============================================================
// TTS HTTP audio engine — module-level singleton.
// ttsApiBase is the BASE URL (e.g. https://crm.junior-it.uz/ms/lesson-runner).
// The lesson owns the /api/tts path and the query params — only `text` and `g`.
// ============================================================
function buildTtsUrl(base, text, gender) {
  if (!base) return '';
  const params = new URLSearchParams({
    text: String(text).slice(0, 1000),
    g: gender === 'f' ? 'f' : 'm',   // default male
  });
  return `${base.replace(/\/$/, '')}/api/tts?${params.toString()}`;
}

let audioEngine = null;
function getAudioEngine() {
  if (typeof window === 'undefined') return null;
  if (!audioEngine) audioEngine = createAudioEngine();
  return audioEngine;
}
function createAudioEngine() {
  const el = typeof window !== 'undefined' ? new Audio() : null;
  if (el) {
    el.preload = 'auto';
    el.crossOrigin = 'anonymous'; // safe even without CORS — audio plays either way
  }
  return {
    el,
    baseUrl: '',
    voiceGender: 'm',
    queue: [], currentIdx: 0, isPlaying: false,
    waitingFor: null, listeners: new Set(),
    setBase(url) { this.baseUrl = (url || '').replace(/\/$/, ''); },
    setGender(g) { this.voiceGender = g === 'f' ? 'f' : 'm'; },
    notify(state) { this.listeners.forEach(fn => fn(state)); },
    loadQueue(segs) { this.stop(); this.queue = Array.isArray(segs) ? segs : []; this.currentIdx = 0; this.waitingFor = null; },
    playSegment(seg) {
      if (!this.el || !this.baseUrl || !seg || !seg.text) return;
      try { this.el.pause(); } catch (e) {}
      // Per-segment `gender` overrides the screen default — lets one screen
      // voice two characters. Falls back to the screen's voiceGender.
      const url = buildTtsUrl(this.baseUrl, seg.text, seg.gender || this.voiceGender);
      this.el.onplay = () => { this.isPlaying = true; this.notify({ isPlaying: true }); };
      this.el.onended = () => { this.isPlaying = false; this.notify({ isPlaying: false }); this.handleEnd(seg); };
      this.el.onerror = () => { this.isPlaying = false; this.notify({ isPlaying: false }); };
      this.el.src = url;
      const p = this.el.play();
      if (p && typeof p.catch === 'function') p.catch(() => { /* autoplay blocked — silent */ });
    },
    handleEnd(seg) {
      if (seg.waits_for) {
        this.waitingFor = seg.waits_for;
        this.notify({ isPlaying: false, waitingFor: seg.waits_for });
      } else {
        this.currentIdx++;
        this.playNext();
      }
    },
    playNext() { if (this.currentIdx < this.queue.length) this.playSegment(this.queue[this.currentIdx]); },
    start() { this.currentIdx = 0; this.waitingFor = null; this.playNext(); },
    triggerEvent(type, target) {
      if (!this.waitingFor) return;
      const matches = this.waitingFor.type === type
        && (this.waitingFor.target === target || !this.waitingFor.target);
      if (matches) { this.waitingFor = null; this.currentIdx++; this.playNext(); }
    },
    pushOneOff(text) {
      this.queue.push({ id: 'oneoff_' + Date.now(), text, trigger: 'manual', waits_for: null });
      this.currentIdx = this.queue.length - 1;
      this.playNext();
    },
    replay() { if (this.currentIdx > 0) this.currentIdx--; this.waitingFor = null; this.playNext(); },
    stop() {
      if (this.el) { try { this.el.pause(); this.el.removeAttribute('src'); this.el.load(); } catch (e) {} }
      this.isPlaying = false; this.notify({ isPlaying: false });
    },
  };
}

// voiceGender ('f' | 'm') is chosen by the screen — see threading note below.
function useAudio(segments, voiceGender, ttsApiBase) {
  const [state, setState] = useState({ isPlaying: false, muted: false, waitingFor: null });
  const engineRef = useRef(null);

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return;
    engineRef.current = engine;
    engine.setBase(ttsApiBase);
    engine.setGender(voiceGender);
    const listener = (s) => setState(prev => ({ ...prev, ...s }));
    engine.listeners.add(listener);
    if (segments && segments.length > 0 && !state.muted && ttsApiBase) {
      engine.loadQueue(segments);
      const t = setTimeout(() => engine.start(), 300);
      return () => { clearTimeout(t); engine.listeners.delete(listener); engine.stop(); };
    }
    return () => { engine.listeners.delete(listener); engine.stop(); };
    // eslint-disable-next-line
  }, [segments, voiceGender, ttsApiBase]);

  return {
    ...state,
    triggerEvent: (type, target) => engineRef.current?.triggerEvent(type, target),
    replay: () => engineRef.current?.replay(),
    pushOneOff: (text) => { if (!state.muted) engineRef.current?.pushOneOff(text); },
    toggleMute: () => setState(prev => {
      const muted = !prev.muted;
      if (muted) engineRef.current?.stop();
      return { ...prev, muted };
    }),
  };
}
```

**Threading `ttsApiBase` + gender through screens:** the main lesson receives `ttsApiBase` as a prop and passes it down via the `common` props object so every screen forwards it into `useAudio`. Do not read it from any global or context — keep it explicit. **Gender is not a prop** — each screen picks its own voice from `CONTENT[lang].sN.voice` (optional, default `'m'`).

```jsx
// in the main lesson:
const common = { screenIdx, lang, studentName, ttsApiBase, /* ... */ };

// in each screen — pick the voice for THIS screen from CONTENT (default male):
const c = CONTENT[lang].s4;
const audio = useAudio(audioSegs, c.voice || 'm', ttsApiBase);
```

Notes:
- `lang` is still threaded into screens for **content selection** (`CONTENT.uz` vs `CONTENT.ru`) — but it is never sent to the TTS server; the language is encoded in the inline markers within each audio string.
- Gender lives entirely **inside the lesson**: set `voice: 'm'` (or `'f'`) on a `CONTENT` screen to change that screen's narrator. For a single screen that voices two characters, give individual audio segments a `gender` field (e.g. `{ id, text, gender: 'm', ... }`) — it overrides the screen default.

### Audio segment format

```js
// One segment, plays on mount, then waits for the student to pick an option:
[{ id: 'q', text: c.audio_q, trigger: 'on_mount', waits_for: { type: 'option_picked' } }]

// Multi-segment narration where each step waits for a button click on the "step" target:
[
  { id: 's1', text: '...', trigger: 'on_mount',       waits_for: { type: 'button_click', target: 'step' } },
  { id: 's2', text: '...', trigger: 'after_previous', waits_for: { type: 'button_click', target: 'step' } },
  { id: 's3', text: '...', trigger: 'after_previous', waits_for: { type: 'button_click', target: 'next' } },
]
```

**Supported `waits_for.type` values** — pick the one that matches your screen:
- `option_picked` — student clicked an answer button (MC, hook)
- `check_pressed` — student clicked a "Check" / "Tekshirish" button (slider, num-input)
- `button_click` with `target: 'step'` — student clicked "Next step" in a step-by-step screen
- `button_click` with `target: 'next'` — student clicked the main "Davom" / "Дальше" button to advance the screen
- omit `waits_for` — auto-advance to the next segment (or just stop if last)

In your screen component, fire the matching event when the student interacts:

```jsx
audio.triggerEvent('option_picked');
audio.triggerEvent('check_pressed');
audio.triggerEvent('button_click', 'step');
audio.triggerEvent('button_click', 'next');
```

After an answer, push a feedback line on top of the queue:

```jsx
audio.pushOneOff(isCorrect ? c.audio_fb_correct : c.audio_fb_wrong);
```

### TTS quality rules

- Write audio in **complete natural sentences** — they're read aloud
- **Wrap every audio string in language markers** (ElevenLabs v3): open `uz` audio with `[O'zbekcha talaffuz]`, `ru` audio with `[Русское произношение]`, and mark English stretches with `[English pronunciation] ... [end]`. See §"Language markers" for the full convention.
- **Never include `studentName` in audio text.** Audio is cached server-side by `sha256(g|text)` — if every student's name appears in audio, every student gets a unique cache key and triggers a fresh TTS generation (slow + costly). Use generic greetings: "Salom, do'st!" / "Salom!" / "Привет, друг!". The student's actual name appears in the visible UI only.
- **Never** use `%`, `/`, `²`, `+`, `=`, `×` in audio text — write words: "foiz", "bo'lingan", "kvadrat", "plyus", "teng", "ko'paytir"
- Numeric fractions: write words — "bir ikkidan" instead of "1/2"; "bir uchdan", "bir to'rtdan", "bir oltidan", etc.
- For Russian: "одна вторая", "одна третья", "одна четвёртая", "одна шестая", and "плюс", "равно", "умножить"
- Keep segments under ~25 seconds (60-80 words). Split long explanations into multiple segments
- Audio scripts are **static strings**, never functions of `studentName`. `c.audio` is a string. `c.title` (visible text) can be a `(name) => ...` function

### ElevenLabs audio tags (expressive narration)

The TTS provider is **ElevenLabs v3**. The model supports inline bracket tags to make narration sound more natural and human — laughs, pauses, whispers, emotional shifts. Use them sparingly to bring scripts to life.

**Tag syntax:** square brackets, lowercase, inline within the text. The tag affects the words **after** it until the next tag or end of utterance.

**Supported tags (use only these):**

| Tag                | Effect                                          | Use for                                  |
|--------------------|-------------------------------------------------|------------------------------------------|
| `[laughs]`         | Single laugh + continue                         | Friendly reactions, light moments        |
| `[laughs harder]`  | Stronger laugh                                  | A genuinely funny twist                  |
| `[starts laughing]`| Gradual laugh leading into next words           | Reacting to an absurd wrong answer       |
| `[chuckle]`        | Brief soft chuckle (single beat)                | Mild amusement, encouragement            |
| `[giggle]`         | Light, playful giggle                           | Childlike or surprised joy               |
| `[whispers]`       | Whispered delivery                              | "Secret tip", aside, confidential        |
| `[sighs]`          | Short sigh                                      | Mild patience or reflection              |
| `[gasps]`          | Sharp inhale                                    | Surprise, "Oh!"                          |
| `[clears throat]`  | Throat clear                                    | Transition to a serious point            |
| `[pause]`          | Short pause (~0.5s)                             | Beat before a punchline / important word |
| `[long pause]`     | Longer pause (~1.2s)                            | Dramatic emphasis                        |
| `[excited]`        | Excited tone for the next phrase                | Praise, "Wonderful!"                     |
| `[curious]`        | Curious, questioning intonation                 | Posing a question to the student         |
| `[sarcastic]`      | Sarcastic delivery                              | Playful "really?" reactions              |
| `[mischievously]`  | Sneaky, playful tone                            | "Watch this trick..."                    |

**Examples:**

```js
// Friendly reactions in feedback:
audio_fb_correct: "[chuckle] Yes! That's exactly right.",
audio_fb_wrong: "[sighs] Not quite. Let's look again.",

// Dramatic pause before a key term:
audio: "Endi siz Pifagor teoremasini ko'rasiz. [pause] A kvadrat plyus be kvadrat teng se kvadrat.",

// Conspiratorial tip:
audio: "[whispers] Bir sirni aytaman: vaqt ifodasiga qarang, hammasi oson bo'ladi.",

// Light moment after an obvious wrong answer:
correct_text: "[laughs] Yes — water boils at 100 degrees. Always. Every time. It's a fact.",

// Welcoming hook:
audio: "[excited] Salom, do'st! [pause] Bugun juda qiziqarli mavzu — kvadrat tenglamalar.",
```

**Rules for tags:**
- **Use tags sparingly** — 0 to 2 tags per audio segment. Over-tagged audio sounds theatrical and tires the listener
- **Never** open the lesson with `[laughs]` or `[laughs harder]` — first impressions need warmth, not comedy
- **Don't** put tags right next to each other — `[gasps] [laughs]` reads as one weird sound. Spread them across the sentence
- Tags belong to the **expressive** screens (hook, friendly feedback, reflective moments). Pure information screens (rule, formula breakdown) should be clean prose without tags
- Tags are part of the cached audio text — same text + same tags = same cached file. Don't randomize tags across renders

### Language markers — explicit uz / ru / en (ElevenLabs v3)

The TTS is **ElevenLabs v3**, which is multilingual but pronounces each stretch best when the language is **marked explicitly**. This matters most for **Uzbek**: without a marker v3 can drift toward Russian/Turkish phonetics. So **every audio string is wrapped in language markers** — don't rely on auto-detection. Lessons work in three languages: **Uzbek, Russian, English**.

**The three markers (each closed by `[end]`):**

| Language | Marker                              |
|----------|-------------------------------------|
| Uzbek    | `[O'zbekcha talaffuz] ... [end]`    |
| Russian  | `[Русское произношение] ... [end]`  |
| English  | `[English pronunciation] ... [end]` |

`[end]` closes the current language and returns to the one before it. If a marker runs to the very end of the segment, `[end]` may be omitted.

**Rule of thumb — open with the host-language marker, switch for foreign stretches, `[end]` back:**
- A `uz` audio string **starts with** `[O'zbekcha talaffuz]`.
- A `ru` audio string **starts with** `[Русское произношение]`.
- English words/sentences inside get `[English pronunciation] ... [end]`, then you return to the host language.

**Examples — Uzbek lesson teaching English:**

```js
// Host = Uzbek; the target English sentence is read in English:
audio_q: "[O'zbekcha talaffuz] Quyidagi gapni tahlil qiling. [English pronunciation] She watches TV every evening. [end] Bu Present Simple gapmi?",

// Comparing two English forms inside Uzbek narration:
audio: "[O'zbekcha talaffuz] Birinchi shakl: [English pronunciation] I play football. [end] Bu odat. Ikkinchi: [English pronunciation] I am playing football. [end] Bu hozir.",

// Single English word inside Uzbek:
audio: "[O'zbekcha talaffuz] Vaqt ifodasi [English pronunciation] now [end] doim Present Continuous bilan keladi.",

// Pure Uzbek narration still gets the host marker:
audio: "[O'zbekcha talaffuz] Salom, do'st! Bugun qiziqarli mavzu bor.",
```

**Examples — Russian lesson teaching English:**

```js
audio: "[Русское произношение] Смотри. [English pronunciation] know [end] — это знать. Это состояние, не действие.",
audio_q: "[Русское произношение] Какая форма верная? [English pronunciation] He ... chocolate. [end]",
```

**Rules:**
- **Always open with the host-language marker** (`[O'zbekcha talaffuz]` for uz, `[Русское произношение]` for ru) — even for pure host-language text. This is the v3 convention.
- Mark an English stretch with `[English pronunciation] ... [end]` only when it should be pronounced **in English**. Grammar terms used as host-language words ("Present Simple", "Continuous") may be transliterated instead ("Prezent Simpl", "Kontinuous") and left in the host stream.
- The marked phrase must be **complete and grammatical** — don't split mid-word like `wash[English pronunciation]ing[end]`.
- **Spell the markers exactly** as in the table — they are the tokens the server recognizes.
- Other languages (rare): use the generalized form `[language: tr] ...turkish... [end]`. `[English pronunciation]` ≡ `[language: en]`.

**Combining with expressive tags** — emotional/voice tags belong in the host-language section, **never inside** a foreign bracketed region:

```js
// OK — tag in the host (Uzbek) section:
audio: "[O'zbekcha talaffuz] [chuckle] Bir o'quvchi shunday dedi: [English pronunciation] I am liking pizza. [end] Bu noto'g'ri.",

// Invalid — emotional tag inside the English region:
// audio: "... [English pronunciation] [chuckle] hello [end] ..."
```

---

## SFX — correct/wrong sound effects

In addition to streamed TTS narration, the lesson plays **two short sound effects** — one when a scored answer is marked correct, one when it's marked wrong. The mentor supplies these as URLs via `correctSoundUrl` and `wrongSoundUrl` props. They are typically <1 second mp3/wav files hosted on the platform CDN.

### Required `useSfx` hook (use verbatim)

Paste this block near the audio engine, before screen components:

```jsx
// ============================================================
// SFX — short correct/wrong sounds, fed in via props.
// One audio element per kind, reused across plays. Volume is fixed
// (0.6 of the device max) to sit under TTS narration.
// ============================================================
function useSfx(correctSoundUrl, wrongSoundUrl) {
  const correctRef = useRef(null);
  const wrongRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (correctSoundUrl) {
      const a = new Audio(correctSoundUrl);
      a.preload = 'auto';
      a.volume = 0.6;
      correctRef.current = a;
    }
    if (wrongSoundUrl) {
      const a = new Audio(wrongSoundUrl);
      a.preload = 'auto';
      a.volume = 0.6;
      wrongRef.current = a;
    }
    return () => {
      try { correctRef.current?.pause(); } catch (e) {}
      try { wrongRef.current?.pause(); } catch (e) {}
      correctRef.current = null;
      wrongRef.current = null;
    };
  }, [correctSoundUrl, wrongSoundUrl]);

  const play = useCallback((kind) => {
    const ref = kind === 'correct' ? correctRef : wrongRef;
    const a = ref.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      const p = a.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (e) {}
  }, []);

  return { playCorrect: () => play('correct'), playWrong: () => play('wrong') };
}
```

**Threading SFX through screens:** the main lesson creates one `sfx` instance and passes it down via the `common` props object alongside `ttsApiBase`. Every screen that scores an answer calls `sfx.playCorrect()` or `sfx.playWrong()` immediately upon revealing the verdict:

```jsx
// in the main lesson:
const sfx = useSfx(correctSoundUrl, wrongSoundUrl);
const common = { screenIdx, lang, studentName, ttsApiBase, sfx, /* ... */ };

// in any scoring screen, after determining correctness:
if (correct) sfx.playCorrect(); else sfx.playWrong();
```

The provided `MCScreen` and `S6_NumInput` patterns already accept `sfx` and call it — see the updated component code below. Wire `sfx` into any custom scoring screen you build.

### SFX rules

- **Never** play SFX on the hook screen (`s0`) — it has no right/wrong
- **Never** play SFX on info screens (analysis, concept, rule, full-analysis, case-start) — only on scored answers
- SFX plays **once** per answer reveal — guard against double-plays (the screen's `revealed` state already guarantees this)
- SFX is fire-and-forget: if the audio fails (autoplay blocked, network), the lesson must still work. Wrap in try/catch
- Don't overlay SFX on TTS — but in practice the SFX is short (<1 s) and finishes before the per-option TTS feedback starts at the ~400 ms mark. No explicit pause needed.

---

## Media assets (images, videos, audio)

For lessons that need photographs, illustrations, custom diagrams as images, short clips, or pre-recorded audio (beyond SVG drawings the lesson itself generates), **you define the asset manifest inside the lesson `.jsx`** as a `DEFAULT_ASSETS` constant. The platform does **not** deliver a manifest — it only supplies `assetsBase` (the media-library base URL) as a prop. (An `assets` prop also exists as an optional runtime override, but it is normally `undefined`, so the lesson relies on `DEFAULT_ASSETS`.)

### Why this design

Assets are keyed by stable names (`img_hook`, `vid_intro`, `aud_pronounce`) and the actual file is referenced by `path` inside `DEFAULT_ASSETS`. `path` may be a bare filename (resolved against `assetsBase` at runtime) or an absolute `https://` URL (used as-is). This means:

- Asset references stay keyed and readable — render code never hardcodes a raw URL inline
- For library files, only `assetsBase` changes between dev / staging / prod — `DEFAULT_ASSETS` paths stay the same
- A lesson with no assets is still valid — SVG-only lessons are fine

### Key naming convention

Assets are keyed with a **type prefix + descriptive slug**:

| Prefix  | Use for                                              | Examples                                              |
|---------|------------------------------------------------------|-------------------------------------------------------|
| `img_`  | Static images (jpg, png, webp, svg files)            | `img_hook`, `img_diagram_1`, `img_outro`              |
| `vid_`  | Video clips (mp4)                                    | `vid_intro`, `vid_teacher_demo`, `vid_animation`      |
| `aud_`  | Audio clips beyond TTS (pronunciation, music, jingles) | `aud_pronounce`, `aud_correct_jingle`               |

The prefix is meaningful: when the lesson sees `assets.img_X` it knows to render `<img>`; for `vid_X` it renders `<video>`; for `aud_X` it renders `<audio>`. **You** assign the correct prefix when you write the key into `DEFAULT_ASSETS`, based on the file type the mentor described.

### Asset object shape

Each entry in your `DEFAULT_ASSETS` object is an object — **not a string URL**. The lesson code combines `path` with `assetsBase` at runtime (or uses `path` as-is if it's already absolute).

```js
const DEFAULT_ASSETS = {
  img_hook: {
    path: 'ebe922af8d4560c73368a88eeac07d16.png',   // filename only → resolved via assetsBase
    width: 1024,
    height: 768,
    aspectRatio: '4:3',
    description: 'boy football jersey',           // ≤ 10 words
  },
  vid_intro: {
    path: 'sarah-whiteboard.mp4',
    width: 720,
    height: 405,
    aspectRatio: '16:9',
    duration: 12,                                   // seconds
    description: 'teacher whiteboard writing',
  },
  vid_external: {
    path: 'https://cdn.partner.com/foo.mp4',       // already absolute → used as-is
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    description: 'partner stock clip',
  },
  aud_pronounce: {
    path: 'i-play.mp3',
    duration: 3,
    description: 'native I play football',
  },
}
```

Where the values come from: the mentor uploads files to the media library and lists them in the **prompt body** (filename or absolute URL + dimensions/duration + a short description, optionally pinned to a screen). You transcribe that list into the `DEFAULT_ASSETS` constant at the top of the lesson. At render time the platform passes only `assetsBase` (the provider base URL); the lesson resolves each `path` against it via `resolveAssetUrl`.

### Required `resolveAssetUrl` helper (paste verbatim)

Place this near the top of your lesson file, next to `buildTtsUrl`:

```js
function resolveAssetUrl(asset, base) {
  if (!asset || !asset.path) return null;
  // External URLs pass through untouched — useful for stock CDNs, YouTube embeds, etc.
  if (/^https?:\/\//i.test(asset.path)) return asset.path;
  // Otherwise prepend the provider base
  return `${(base || '').replace(/\/$/, '')}/${asset.path.replace(/^\//, '')}`;
}
```

**This is the ONLY way to derive an asset URL inside the lesson.** Never concatenate `assetsBase + asset.path` by hand — `resolveAssetUrl` handles trailing slashes, leading slashes, and the absolute-URL passthrough.

### Asset list in the prompt → `DEFAULT_ASSETS`

When the mentor needs media, they list the available files in the **prompt body** in roughly this format (filename or absolute URL, dimensions/duration, a short description, and optional screen pinning):

```
## Available assets

Images:
- img_hook: ebe922af8d4560c73368a88eeac07d16.png (640×480, 4:3) — "boy football jersey" → USE ON: s0 (hook)
- img_outro: https://cdn.partner.com/clocks.png (1280×720, 16:9) — "two clocks ticking"

Videos:
- vid_sarah: sarah-whiteboard.mp4 (720×405, 16:9, 12s) — "teacher whiteboard writing" → USE ON: s7

Audio (separate from TTS narration):
- aud_pronounce: i-play.mp3 (3s) — "native I play football"
```

You transcribe that list into the `DEFAULT_ASSETS` constant (see shape above), choosing the right key prefix (`img_`/`vid_`/`aud_`). Then reference each asset as `assets.<key>` in code and resolve with `resolveAssetUrl(assets.<key>, assetsBase)`. Markers:
- `USE ON: sN` — the mentor pinned this asset to a specific screen; place it there
- no marker — you decide where it fits best pedagogically
- Each asset is OPTIONAL — always render conditionally with `assets.<key> && ...`, with an SVG fallback or graceful omission

### Lesson code patterns

**Image with fallback:**

```jsx
function S0_Hook({ assets, assetsBase, ... }) {
  const hookUrl = resolveAssetUrl(assets?.img_hook, assetsBase);
  const [imgError, setImgError] = useState(false);

  return (
    <VideoStage ...>
      {hookUrl && !imgError ? (
        <img
          src={hookUrl}
          width={assets.img_hook.width}
          height={assets.img_hook.height}
          alt={assets.img_hook.description || 'lesson illustration'}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            maxWidth: 480,
            height: 'auto',
            aspectRatio: assets.img_hook.aspectRatio,
            objectFit: 'contain',
            borderRadius: 14,
          }}
        />
      ) : (
        <SvgHookFallback />  /* SVG fallback when no asset or image fails */
      )}
      {/* ... */}
    </VideoStage>
  );
}
```

**Video:**

```jsx
{(() => {
  const vidUrl = resolveAssetUrl(assets?.vid_sarah, assetsBase);
  if (!vidUrl) return null;
  return (
    <video
      src={vidUrl}
      width={assets.vid_sarah.width}
      height={assets.vid_sarah.height}
      controls
      playsInline
      preload="metadata"
      style={{
        width: '100%',
        maxWidth: 640,
        height: 'auto',
        aspectRatio: assets.vid_sarah.aspectRatio,
        borderRadius: 14,
      }}
    >
      {assets.vid_sarah.description}
    </video>
  );
})()}
```

**Audio clip (one-off, not narration):**

```jsx
{(() => {
  const audUrl = resolveAssetUrl(assets?.aud_pronounce, assetsBase);
  if (!audUrl) return null;
  return (
    <audio src={audUrl} controls preload="none" style={{ width: '100%' }} />
  );
})()}
```

### Rules — read carefully

- ❌ **Never** put a full URL directly in render JSX (`<img src="https://..."`). URLs live only in `DEFAULT_ASSETS` `path` values; render code derives them through `resolveAssetUrl`.
- ❌ **Never** invent asset keys the mentor didn't list. If the mentor didn't provide `vid_intro`, don't add `assets.vid_intro`.
- ❌ **Never** assume `assets` is defined. Always use optional chaining (`assets?.img_hook`) and conditional rendering (`url && <img .../>`).
- ✅ **Always** wrap asset usage so the lesson degrades gracefully when an asset is missing — fallback to SVG, or just omit the visual entirely.
- ✅ **Always** pass `width`, `height`, and `aspectRatio` to `<img>` and `<video>` to prevent layout shift while loading.
- ✅ **Always** use `description` as the `alt` text on images (it's already mentor-written, ≤ 10 words).
- ✅ If the mentor pinned an asset with a `USE ON: sN` marker, place it on that exact screen — don't second-guess.
- ✅ A lesson without any assets is still valid — SVG-only lessons are fine. Assets are additive, not required.

### `DEFAULT_ASSETS` + merge (the standard mechanism)

Define the manifest as a `DEFAULT_ASSETS` constant at the top of the lesson, then merge it with the (usually-undefined) `assets` prop so a platform override would win if one is ever passed:

```js
const DEFAULT_ASSETS = {
  img_hook: {
    path: 'ebe922af8d4560c73368a88eeac07d16.png',  // filename → resolved via assetsBase
    width: 1024, height: 768, aspectRatio: '4:3',
    description: 'football game scene',
  },
  // ...one entry per asset the mentor listed
};

// In the main lesson:
const mergedAssets = useMemo(
  () => ({ ...DEFAULT_ASSETS, ...(assets || {}) }),
  [assets]
);
// then thread it down: common = { ..., assets: mergedAssets, assetsBase };
```

This is the **normal** flow — the lesson owns its manifest. The `assets` prop is just an optional override; in production it is `undefined`, so `mergedAssets` is exactly `DEFAULT_ASSETS`. If the lesson has no media at all, omit `DEFAULT_ASSETS` and rely on SVG.

### `assetsBase` value examples

The platform sets `assetsBase` to the file provider root, without a trailing slash:

```
'https://qa-crm.junior-it.uz/uploads/media_library'
'https://cdn.junior-it.uz/lessons/eng-tenses-v1'
'https://cdn.example.com'
```

The lesson doesn't care which one — it just concatenates path on top. So the same lesson code works in QA, staging, and prod by swapping this single prop.

---

## AI-graded open questions

Some questions can't be auto-graded by string match — they're **open-ended**, e.g. "Explain in your own words why a hypotenuse is always the longest side", "Give an example where the Pythagorean theorem fails", "Tell me a real-life situation you'd use this in". For these, the lesson posts the question + the student's answer to an AI grading endpoint and renders the AI's verdict + feedback.

### Two answer modes, one per question

Each AI-graded question has **exactly one** input mode, decided when the lesson `.jsx` is authored:

| Mode    | Student input                | Sent to server                       |
|---------|------------------------------|--------------------------------------|
| `text`  | Multi-line `<textarea>`      | JSON: `{ ..., answerText: '...' }`   |
| `voice` | Microphone recording (WebM)  | `multipart/form-data` with audio blob |

**The same screen never offers both at once.** Claude (the lesson author) picks one mode per AI question based on what's pedagogically right: factual recall and short reasoning → `text`; explanation, story-telling, fluency → `voice`. Mix freely across screens.

### Endpoint contract (server-side)

Mentor will host an endpoint. The lesson always calls a **single URL** (`aiGradingEndpoint`) but the request body differs by mode.

**Text mode** — `POST {aiGradingEndpoint}` with `Content-Type: application/json`:

```json
{
  "lessonId": "pythagorean-theorem-v1",
  "screenIdx": 7,
  "question": "Nima uchun gipotenuza har doim eng uzun tomon?",
  "rubric": "Pifagor teoremasiga ko'ra, c² = a² + b², shuning uchun c > a va c > b.",
  "lang": "uz",
  "mode": "text",
  "answerText": "Chunki kvadratlarning yig'indisi katta."
}
```

**Voice mode** — `POST {aiGradingEndpoint}` with `Content-Type: multipart/form-data`, containing fields:

| Field         | Type   | Value                                                    |
|---------------|--------|----------------------------------------------------------|
| `lessonId`    | text   | e.g. `"pythagorean-theorem-v1"`                          |
| `screenIdx`   | text   | e.g. `"7"`                                               |
| `question`    | text   | the question as a string                                 |
| `rubric`      | text   | rubric / model-answer hint for the AI                    |
| `lang`        | text   | `"uz"` or `"ru"`                                         |
| `mode`        | text   | `"voice"`                                                |
| `audio`       | file   | the recorded blob (filename `answer.webm`, MIME `audio/webm`) |

**Response (both modes)** — `200 OK`, `Content-Type: application/json`:

```json
{
  "correct": true,
  "feedback": "Ajoyib tushuntirish! Pifagor teoremasini to'g'ri ishlatdingiz.",
  "transcript": "Chunki kvadratlarning yig'indisi katta..."
}
```

| Field        | Type    | Required | Notes                                                   |
|--------------|---------|----------|---------------------------------------------------------|
| `correct`    | boolean | yes      | true/false verdict for the answer                       |
| `feedback`   | string  | yes      | 1–3 sentence personalised feedback, in the lesson `lang`. **Never** includes the student's name (cache-friendly, even though we don't cache yet, consistency with TTS rules). |
| `transcript` | string  | voice only | The transcribed student answer. Used for the result-screen mistakes review. Omit for text mode (the lesson already has the text). |

**Error responses** (`4xx` / `5xx` / network) — the lesson treats this as **non-scoring**: shows a soft "AI baholay olmadi, lekin urinishing yaxshi" message, records `{ picked: '...', correct: null, type: 'ai-open', mode }` and lets the student advance. AI failures must not block lesson completion.

### Required `gradeAnswer` helper (use verbatim)

Paste this near the audio engine:

```jsx
// ============================================================
// AI grading — POSTs to the mentor-provided endpoint.
// Text mode: JSON body. Voice mode: multipart with audio blob.
// Returns { correct, feedback, transcript? } on success, throws on failure.
// ============================================================
async function gradeAnswer({
  endpoint, lessonId, screenIdx, question, rubric, lang, mode,
  answerText, audioBlob,
}) {
  if (!endpoint) throw new Error('No grading endpoint configured');

  let res;
  if (mode === 'voice') {
    const fd = new FormData();
    fd.append('lessonId', lessonId);
    fd.append('screenIdx', String(screenIdx));
    fd.append('question', question);
    fd.append('rubric', rubric || '');
    fd.append('lang', lang);
    fd.append('mode', 'voice');
    if (audioBlob) {
      fd.append('audio', audioBlob, 'answer.webm');
    }
    res = await fetch(endpoint, { method: 'POST', body: fd });
  } else {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId, screenIdx, question, rubric: rubric || '', lang,
        mode: 'text', answerText: answerText || '',
      }),
    });
  }

  if (!res.ok) throw new Error(`Grading failed: ${res.status}`);
  const data = await res.json();
  // Soft-validate shape:
  if (typeof data.correct !== 'boolean' || typeof data.feedback !== 'string') {
    throw new Error('Malformed grading response');
  }
  return data;
}
```

This is the **only** raw `fetch()` allowed in the entire lesson. Do not use `fetch` for anything else.

### Required `VoiceRecorder` component (use verbatim)

For voice-mode questions, paste this component:

```jsx
// ============================================================
// VoiceRecorder — captures microphone audio into a Blob via MediaRecorder.
// Renders a single big Mic button: idle → recording → ready.
// Calls onReady(blob, durationSec) when the student stops the recording.
// onReset clears the captured blob so the student can re-record.
// ============================================================
function VoiceRecorder({ lang, disabled, onReady }) {
  const [state, setState] = useState('idle'); // 'idle' | 'recording' | 'ready' | 'denied'
  const [duration, setDuration] = useState(0);
  const [blob, setBlob] = useState(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const startRef = useRef(0);
  const timerRef = useRef(null);

  const t = (uz, ru) => lang === 'ru' ? ru : uz;

  const start = async () => {
    if (state === 'recording' || disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4');
      const rec = new MediaRecorder(stream, { mimeType: mime });
      recorderRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const b = new Blob(chunksRef.current, { type: mime });
        setBlob(b);
        setState('ready');
        const d = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
        setDuration(d);
        onReady?.(b, d);
        stream.getTracks().forEach(tr => tr.stop());
        streamRef.current = null;
      };
      startRef.current = Date.now();
      rec.start();
      setState('recording');
      timerRef.current = setInterval(() => {
        setDuration(Math.round((Date.now() - startRef.current) / 1000));
      }, 250);
    } catch (e) {
      setState('denied');
    }
  };

  const stop = () => {
    if (state !== 'recording') return;
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    try { recorderRef.current?.stop(); } catch (e) {}
  };

  const reset = () => {
    setBlob(null);
    setDuration(0);
    setState('idle');
    onReady?.(null, 0);
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    try { recorderRef.current?.stop(); } catch (e) {}
    streamRef.current?.getTracks().forEach(tr => tr.stop());
  }, []);

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    }}>
      {state === 'denied' && (
        <div style={{
          background: C.redBg, color: C.primary, borderRadius: 10,
          padding: '8px 14px', fontSize: 13, textAlign: 'center',
        }}>
          {t("Mikrofonga ruxsat berilmagan. Brauzer sozlamalarini tekshiring.",
            'Микрофон не разрешён. Проверьте настройки браузера.')}
        </div>
      )}

      {state === 'idle' && (
        <motion.button
          whileTap={{ scale: 0.95 }} onClick={start} disabled={disabled}
          style={{
            width: 96, height: 96, borderRadius: '50%',
            background: C.primary, color: '#fff', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: `0 8px 24px ${C.primary}40`,
          }}
        >
          <Mic size={36} />
        </motion.button>
      )}

      {state === 'recording' && (
        <motion.button
          onClick={stop}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{
            width: 96, height: 96, borderRadius: '50%',
            background: C.red2, color: '#fff', border: `3px solid ${C.primary}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Square size={28} fill="#fff" />
        </motion.button>
      )}

      {state === 'ready' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          background: C.green4, border: `1.5px solid ${C.green1}`,
          borderRadius: 14, padding: '12px 20px',
        }}>
          <Check size={22} color={C.green1} />
          <div>
            <div style={{ fontFamily: F.mono, fontSize: 12, color: C.gray1, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {t('Yozildi', 'Записано')}
            </div>
            <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 22, color: C.green1, fontWeight: 600 }}>
              {fmtTime(duration)}
            </div>
          </div>
          <button onClick={reset} style={{
            background: 'transparent', border: 'none', cursor: 'pointer', color: C.gray1,
            padding: 6, display: 'flex', alignItems: 'center',
          }}>
            <RotateCcw size={18} />
          </button>
        </div>
      )}

      <div style={{ fontFamily: F.mono, fontSize: 12, color: C.gray1, height: 18 }}>
        {state === 'idle' && t('Tugmani bosib gapiring', 'Нажмите кнопку и говорите')}
        {state === 'recording' && (
          <>{t('Yozilmoqda', 'Идёт запись')} · {fmtTime(duration)}</>
        )}
        {state === 'ready' && t('Yana yozish uchun ↺', 'Записать заново ↺')}
      </div>
    </div>
  );
}
```

### Required `OpenQuestionScreen` component (use verbatim)

Paste this after `MCScreen`:

```jsx
// ============================================================
// OpenQuestionScreen — AI-graded text or voice answer.
// `mode` is fixed per screen at authoring time ('text' | 'voice').
// Posts to aiGradingEndpoint, renders correct/feedback returned by the AI.
// Plays SFX on the verdict and pushes the feedback line to TTS.
// ============================================================
function OpenQuestionScreen({
  screenIdx, lang, ttsApiBase, sfx, aiGradingEndpoint,
  lessonId, c, mode = 'text',
  progress, totalScreens, storedAnswer, onAnswer, onNext, onBack,
}) {
  const com = CONTENT[lang].common;
  const isMobile = useIsMobile();
  const padX = isMobile ? 12 : 100;

  const audioSegs = useMemo(() => [{
    id: 'q', text: c.audio_q, trigger: 'on_mount',
    waits_for: { type: 'check_pressed' },
  }], [c.audio_q]);
  const audio = useAudio(audioSegs, c.voice || 'm', ttsApiBase);

  const [answerText, setAnswerText] = useState(storedAnswer?.answerText ?? '');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [verdict, setVerdict] = useState(storedAnswer
    ? { correct: storedAnswer.correct, feedback: storedAnswer.feedback, transcript: storedAnswer.transcript }
    : null);

  const canSubmit = !verdict && !submitting && (
    mode === 'text' ? answerText.trim().length >= 3 : !!audioBlob
  );

  const onVoiceReady = useCallback((blob, duration) => {
    setAudioBlob(blob);
    setAudioDuration(duration);
  }, []);

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    audio.triggerEvent('check_pressed');
    try {
      const result = await gradeAnswer({
        endpoint: aiGradingEndpoint,
        lessonId,
        screenIdx,
        question: c.question || c.title,
        rubric: c.rubric || '',
        lang,
        mode,
        answerText: mode === 'text' ? answerText : undefined,
        audioBlob: mode === 'voice' ? audioBlob : undefined,
      });
      setVerdict(result);
      onAnswer(screenIdx, {
        picked: mode === 'text' ? answerText : `[voice ${audioDuration}s]`,
        answerText: mode === 'text' ? answerText : undefined,
        transcript: result.transcript,
        correct: result.correct,
        feedback: result.feedback,
        type: 'ai-open',
        mode,
      });
      if (result.correct) sfx?.playCorrect?.(); else sfx?.playWrong?.();
      setTimeout(() => audio.pushOneOff(result.feedback), 300);
    } catch (e) {
      setError(e.message || 'Error');
      // Non-blocking: record as ungraded so the student can advance
      onAnswer(screenIdx, {
        picked: mode === 'text' ? answerText : `[voice ${audioDuration}s]`,
        answerText: mode === 'text' ? answerText : undefined,
        correct: null,
        type: 'ai-open',
        mode,
        error: e.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <VideoStage progress={progress} kicker={c.kicker} screenIdx={screenIdx} totalScreens={totalScreens} audio={audio}>
      <div style={{
        flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: `${isMobile ? 20 : 40}px ${padX}px`,
        overflow: 'hidden',
      }}>
        <div style={{ width: '100%', maxWidth: 760, margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: F.serif, fontWeight: 600,
              fontSize: isMobile ? 22 : 'clamp(24px, 3.4vw, 34px)',
              lineHeight: 1.2, margin: '0 0 8px',
            }}
          >
            {c.question || c.title}
          </motion.h2>

          {c.hint && (
            <p style={{
              margin: '0 0 18px', color: C.gray1,
              fontSize: 'clamp(13px, 1.7vw, 15px)', lineHeight: 1.5,
            }}>{c.hint}</p>
          )}

          {/* Input area — text mode */}
          {mode === 'text' && !verdict && (
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              disabled={submitting}
              placeholder={c.placeholder || (lang === 'ru'
                ? 'Напишите ваш ответ в 2–4 предложениях...'
                : "2–4 jumlada javobingizni yozing...")}
              style={{
                width: '100%', minHeight: isMobile ? 110 : 140,
                resize: 'vertical',
                fontFamily: F.sans, fontSize: 'clamp(14px, 1.8vw, 16px)',
                lineHeight: 1.5, color: C.text, background: '#fff',
                border: `1.5px solid ${C.text}`, borderRadius: 12,
                padding: '12px 14px', outline: 'none',
                marginBottom: 14,
              }}
            />
          )}

          {/* Input area — voice mode */}
          {mode === 'voice' && !verdict && (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 14px' }}>
              <VoiceRecorder
                lang={lang}
                disabled={submitting}
                onReady={onVoiceReady}
              />
            </div>
          )}

          {/* Submit */}
          {!verdict && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Btn onClick={submit} disabled={!canSubmit} variant="primary">
                {submitting ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                {' '}
                {submitting
                  ? (lang === 'ru' ? 'Проверяется...' : 'Tekshirilmoqda...')
                  : (lang === 'ru' ? 'Отправить' : 'Yuborish')}
              </Btn>
              {error && (
                <span style={{ fontSize: 13, color: C.primary }}>{error}</span>
              )}
            </div>
          )}

          {/* Verdict */}
          <FeedbackBlock show={!!verdict} isCorrect={verdict?.correct === true}>
            <p style={{
              margin: 0, marginBottom: 6, fontFamily: F.mono, fontSize: 12, fontWeight: 700,
              color: verdict?.correct ? C.green1 : C.primary,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              {verdict?.correct
                ? (lang === 'ru' ? 'Верно' : "To'g'ri")
                : (lang === 'ru' ? 'Не совсем' : "Noto'g'ri")}
            </p>
            <p style={{ margin: 0, fontSize: 'clamp(14px, 1.8vw, 16px)', lineHeight: 1.5 }}>
              {verdict?.feedback}
            </p>
            {mode === 'voice' && verdict?.transcript && (
              <p style={{
                margin: '10px 0 0', fontFamily: F.mono, fontSize: 12, color: C.gray1,
                lineHeight: 1.4, fontStyle: 'italic',
              }}>
                "{verdict.transcript}"
              </p>
            )}
          </FeedbackBlock>
        </div>
      </div>

      <NavBar
        onBack={onBack}
        onNext={onNext}
        nextLabel={com.next}
        nextDisabled={!verdict}
        backLabel={com.back}
      />
    </VideoStage>
  );
}
```

### Choosing the mode

In the `CONTENT` block, mark each AI-graded screen with a `mode` field — this is the single source of truth. The screen wrapper reads it once and forwards it to `OpenQuestionScreen`:

```js
// CONTENT.uz.s7_open (example AI screen):
{
  kicker: 'O\'z so\'zlaringiz bilan',
  question: 'Nima uchun gipotenuza har doim eng uzun tomon?',
  rubric: 'a² + b² = c² bo\'lgani uchun c² > a² va c² > b², demak c > a va c > b. Ya\'ni gipotenuza katetlardan har doim uzun.',
  hint: '2-3 ta jumlada tushuntiring.',
  placeholder: 'Misol uchun: chunki...',
  audio_q: 'Nima uchun gipotenuza har doim eng uzun tomon? Javobingizni ikki uch jumlada yozing.',
  mode: 'text', // <— authoring-time decision; CANNOT be changed at runtime
},

// CONTENT.uz.s11_open (different AI screen — voice this time):
{
  kicker: 'Hayotda ishlatish',
  question: 'Pifagor teoremasini hayotda ishlatadigan bir misol keltiring.',
  rubric: 'Yaxshi javoblar: navrol, TV diagonal, masofa hisobi, qurilishda burchak tekshirish, sport maydoni. Misol konkret va to\'g\'ri ishlatilgan bo\'lishi kerak.',
  hint: 'Ovozli xabar yuboring (10-30 soniya).',
  audio_q: 'Pifagor teoremasini hayotda ishlatadigan bir misol keltiring. Ovozli xabar bilan javob bering.',
  mode: 'voice', // <— this question is voice-only
},
```

**Rules:**
- `mode` is set when the lesson is authored. The student does not switch modes mid-question. There is no UI to pick between text and voice — the question simply renders the chosen input.
- For `text` mode: write a `placeholder` field (one line) hinting at the desired answer shape
- For `voice` mode: do not write a placeholder (the recorder UI handles it). Audio script should explicitly invite a voice reply: "Ovozli xabar bilan javob bering"
- Always include a `rubric` — what counts as a correct answer. The AI uses this as the grading criterion. Keep it 1–2 sentences.

### Wiring into the main lesson

The main lesson exposes `lessonId` (constant for the lesson) and threads `sfx` + `aiGradingEndpoint` + `lessonId` into `OpenQuestionScreen`:

```jsx
const LESSON_ID = 'pythagorean-theorem-v1';

const common = {
  screenIdx, lang, studentName, ttsApiBase, sfx, aiGradingEndpoint,
  progress, totalScreens,
  storedAnswer: answers[screenIdx],
  onAnswer: recordAnswer,
  onNext: goNext,
  onBack: screenIdx > 0 ? goBack : null,
};

// In the switch:
{screenIdx === 7 && (
  <OpenQuestionScreen
    {...common}
    lessonId={LESSON_ID}
    c={CONTENT[lang].s7_open}
    mode={CONTENT[lang].s7_open.mode}
  />
)}
```

### Scoring AI screens

AI-graded screens count toward the final score, **but with caveats:**
- A successful `correct: true` from the AI is a hit (`answers[idx].correct === true`)
- `correct: false` is a miss
- `correct: null` (AI call failed) is **not counted** — neither pass nor fail. Skip it in `scoredIdxs` calculation, or filter:

```jsx
const correctCount = scoredIdxs.filter(i => answers[i]?.correct === true).length;
// network failures (correct: null) won't be added here either way
```

In the result-screen mistakes review, show the AI feedback as the "explanation" instead of the wrong/correct text from CONTENT.

### Anti-patterns for AI screens

- ❌ Don't render BOTH text and voice inputs in the same screen. Pick one per question at authoring time.
- ❌ Don't block the student on AI failure — record `correct: null` and let them advance.
- ❌ Don't include `studentName` in the question / rubric / audio_q strings. Same cache rules.
- ❌ Don't add 3 or more AI-graded screens in a single lesson — the back-and-forth is heavier than MC. 1–2 per lesson is the sweet spot.
- ❌ Don't put an AI-graded screen as the **final test** (s13). Final test should be deterministic (MC or NumInput) so the score is reliable. AI screens fit best as mid-lesson reflection or capstone.

---

## Screen-based architecture (mandatory)

The lesson is a sequence of **screens** indexed by `screenIdx`, not modules or chapters. The top-level component holds `screenIdx`, `answers`, and `startTime`, and switches between screen components inside an `<AnimatePresence mode="wait">`.

```jsx
const LESSON_ID = 'my-lesson-v1';

export default function MyLesson({
  studentName, lang = 'uz', ttsApiBase,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint,
  assets, assetsBase,
  onFinished,
}) {
  const startTime = useRef(Date.now());
  const [screenIdx, setScreenIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [screenIdx]: { picked, correct, type, ... } }

  // Lesson owns its manifest via DEFAULT_ASSETS; the `assets` prop (usually
  // undefined) is just an optional override. Omit DEFAULT_ASSETS if no media.
  const mergedAssets = useMemo(() => ({ ...DEFAULT_ASSETS, ...(assets || {}) }), [assets]);

  const totalScreens = CONTENT.TOTAL_SCREENS;
  const progress = ((screenIdx + 1) / totalScreens) * 100;

  const goNext = () => setScreenIdx(i => Math.min(i + 1, totalScreens - 1));
  const goBack = () => setScreenIdx(i => Math.max(i - 1, 0));
  const recordAnswer = (idx, payload) => setAnswers(a => ({ ...a, [idx]: payload }));

  const sfx = useSfx(correctSoundUrl, wrongSoundUrl);

  const handleFinish = () => { /* build payload, call onFinished(payload) */ };

  const common = {
    screenIdx, lang, studentName, ttsApiBase, sfx, aiGradingEndpoint,
    assets: mergedAssets, assetsBase,
    progress, totalScreens,
    storedAnswer: answers[screenIdx],
    onAnswer: recordAnswer,
    onNext: goNext,
    onBack: screenIdx > 0 ? goBack : null,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenIdx}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {screenIdx === 0 && <S0_Hook {...common} />}
        {screenIdx === 1 && <S1_Analysis {...common} />}
        {/* ... */}
        {/* AI-graded open question (mode read from CONTENT): */}
        {screenIdx === 9 && (
          <OpenQuestionScreen
            {...common}
            lessonId={LESSON_ID}
            c={CONTENT[lang].s9_open}
            mode={CONTENT[lang].s9_open.mode}
          />
        )}
        {/* ... */}
        {screenIdx === totalScreens - 1 && <SN_Result {...common} answers={answers} onFinish={handleFinish} />}
      </motion.div>
    </AnimatePresence>
  );
}
```

Every screen receives `ttsApiBase`, `sfx`, and `aiGradingEndpoint` and forwards them into its own audio/SFX/AI calls. The main lesson owns the entire answers state — nothing about answers lives in localStorage, sessionStorage, or context.

### Recommended screen flow (12-15 screens)

| Idx | Type           | Purpose                                                              |
|-----|----------------|----------------------------------------------------------------------|
| 0   | Hook           | Narrative scenario with provocative question, 3 picks — no wrong answer |
| 1   | Analysis       | Step-by-step visual reveal explaining WHY the obvious answer is wrong |
| 2   | Interactive    | Slider / drag / picker that lets the student explore the concept     |
| 3   | Concept        | Name the concept introduced by the interaction                        |
| 4   | MC Mikro       | First small test (4 options, per-option feedback)                    |
| 5   | Rule           | 3-bullet recap of the method                                          |
| 6   | NumInput       | Fill-in-the-blank to check mechanical understanding                  |
| 7   | Full analysis  | 4-step worked example with typographic math                          |
| 8   | MC Mikro       | Second small test (4 options, per-option feedback)                   |
| 9   | **AI-open**    | (Optional, **one per lesson**) AI-graded text OR voice reflection — see §"AI-graded open questions" |
| 10  | Case start     | Real-world scenario with 3 cards                                     |
| 11  | MC step        | First sub-step of the case                                            |
| 12  | MC step + final-case | Second sub-step / solve the original case                       |
| 13  | MC final test  | Independent final question (deterministic, not AI) — counts heavier  |
| 14  | Result         | Award/sparkles, name, score, mistakes review, finish CTA            |

Smaller lessons can collapse to 8-10 screens. The structure (hook → analysis → interactive → concept → mikro → rule → mikro → optional AI reflection → case → final → result) is what matters. **AI screens are optional and limited to 1–2 per lesson** — they're powerful but slow (network round-trip to grading server). Place them where deep reflection helps; never as the final test.

---

## `CONTENT` object structure

All UI strings, audio scripts, and per-option feedback live in one `CONTENT` object at the top of the file (after constants, before components). Mirror exactly for `uz` and `ru`.

**Optional per-screen `voice` field.** Any screen may carry `voice: 'f' | 'm'` to set its TTS narrator gender (the `g` param). Omit it for the default male voice (`'m'`). Use it to give a screen's narrating character a matching voice — set the **same** `voice` for the same screen in both `uz` and `ru`. This is the only place gender is decided; there is no gender prop.

```js
const CONTENT = {
  TOTAL_SCREENS: 15,
  uz: {
    s0: {  // hook
      kicker: 'Topishmoq',
      title: (name) => `Salom, ${name}! [scenario sentence]`,  // VISUAL — name allowed
      sub: '[provocative line ending in question]',
      opts: ['Ha, to\'g\'ri', 'Yo\'q, noto\'g\'ri', 'Ishonchim komil emas'],
      // AUDIO — static. May use ElevenLabs tags sparingly. For an English-lesson hook,
      // use [English pronunciation]...[end] to mark the foreign-language stretch:
      audio: `[O'zbekcha talaffuz] [excited] Salom, do'st! [full natural-language audio script — NO student name]`,
      // voice: 'm',  // OPTIONAL — male narrator for this screen; default is 'f'
    },
    s4: {  // MC question
      kicker: 'Mashq',
      question: '[question text, can contain "1/4" — will be rendered as Frac inline if you wrap it]',
      opts: ['8', '10', '12', '24'],
      correctIdx: 2,
      correct_text: '12! [why it is right]',
      wrong_0:     '8 — [specific reason 8 is wrong]',
      wrong_1:     '10 — [reason]',
      wrong_3:     '24 — [reason, often "right but not the smallest"]',
      // For English-grammar lessons, mark target English sentences:
      // audio_q: 'Quyidagi gapni tahlil qiling. [English pronunciation] She watches TV every day. [end] Qaysi tense?',
      audio_q:     '[question read aloud, no symbols]',
    },
    s6: {  // NumInput
      kicker: 'Yozing',
      title: '1/3 = ?/12. So\'roq belgisi o\'rniga qaysi son keladi?',
      btnCheck: 'Tekshirish',
      fbCorrectTitle: 'Ajoyib!',
      fbCorrect: 'Ha, 4! Chunki 1/3 = (1×4)/(3×4) = 4/12.',
      fbWrongTitle: 'Qayta o\'ylab ko\'ring',
      fbWrong: '[why their answer is wrong, hint for next try]',
      audio_q: '[read aloud]',
      audio_fb_correct: 'To\'g\'ri!',
      audio_fb_wrong: '[hint]',
    },
    s14: {  // Result
      kicker: 'Yakun',
      title: 'Asosiyni',
      titleEm: 'eslab qolamiz',
      scoreLabel: 'Sizning natijangiz',
      msgExcellent: 'Ajoyib! Sizda hammasi yaxshi.',
      msgGood: 'Yaxshi. Yana bir oz mashq qiling.',
      msgRepeat: 'Mavzuni yana ko\'rib chiqing va qaytadan urinib ko\'ring.',
      mainLabel: 'Asosiy',
      main1: '[key takeaway 1]',
      main2: '[key takeaway 2]',
      main3: '[key takeaway 3]',
      main4: '[key takeaway 4]',
      btnFinish: 'Darsni tugatish',
      audio: `Yakunlandi. [farewell + recap — NO student name]`, // static, cache-friendly
    },
    // === AI-graded open question (text mode) ===
    s9_open: {
      kicker: 'O\'z so\'zlaringiz bilan',
      question: '[Open-ended reflection question, e.g. "Nima uchun gipotenuza har doim eng uzun tomon?"]',
      rubric: '[1-2 sentences describing what a correct answer must contain. Used by the AI to grade.]',
      hint: '2-3 ta jumlada tushuntiring.',
      placeholder: 'Misol uchun: chunki...',
      audio_q: '[Question read aloud — no symbols, no studentName]',
      mode: 'text',  // <— authoring-time decision; CANNOT be changed at runtime
    },
    // === AI-graded open question (voice mode) — alternative ===
    s9_open_voice_example: {
      kicker: 'Ovozli javob',
      question: '[Open-ended question that benefits from spoken explanation]',
      rubric: '[criteria for a correct spoken answer]',
      hint: 'Ovozli xabar yuboring (10-30 soniya).',
      audio_q: '[Read aloud + invite voice reply: "Ovozli xabar bilan javob bering"]',
      mode: 'voice',
    },
    // ... s1, s2, s3, s5, s7, s8, s10, s11, s12, s13 similarly
  },
  ru: {
    // mirror of uz, same keys, Russian values
  },
};
```

Read content inside each screen via `const c = CONTENT[lang].s4;` etc. **Note:** AI-graded screens follow the `s9_open` / `sN_open` naming so they're easy to spot. The `mode` field is mandatory and immutable per screen.

---

## Color palette (mandatory)

```js
const C = {
  bg: 'rgb(245, 245, 245)',
  text: '#000',
  primary: '#fe5b1a',     // primary action, highlights, wrong-answer borders
  green1: '#10b981',      // success, correct answers
  green2: '#6ee7b7',
  green3: '#a7f3d0',
  green4: '#ecfdf5',      // soft success background
  yellow1: '#fcd34d',     // award sparkles
  yellow2: '#fde68a',
  yellow3: '#fffbeb',
  yellow4: '#ffd659',
  gray1: '#94a3b8',       // muted text, labels
  gray2: '#5e5e5e33',     // borders, dividers
  red1: '#ff9090',
  red2: '#ff6a6a',
  redBg: '#fff5f5',       // wrong-answer card background
  orange1: '#f59e0b',
  blue: '#019acb',        // info/secondary highlight
  lightOrange: '#ff8b3e',
};
```

- **Primary action** (CTAs, current marker, hook button selected): `C.primary` or `C.text`
- **Success**: `C.green1` text on `C.green4` background
- **Error**: `C.primary` text on `C.redBg` background (we don't use harsh red — the orange `primary` reads as "wrong" against the green of "right")
- **Info / neutral highlights**: `C.blue`
- **Labels, muted text**: `C.gray1`
- **Borders, dividers**: `C.gray2`
- **Backgrounds**: page bg = `C.bg`, cards = `#fff`

Do not invent hex values outside this palette.

## Fonts

```js
const F = {
  sans: '"Inter", system-ui, -apple-system, sans-serif',
  serif: '"Fraunces", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};
```

- Headings, chapter titles, big numbers, fractions: `F.serif`, often `fontStyle: 'italic'` for emphasis
- Body text: `F.sans`
- Labels, captions, code-like values, screen counter: `F.mono` with `letterSpacing: '0.15em'`, `textTransform: 'uppercase'`

---

## Required hook: `useIsMobile`

```jsx
function useIsMobile(breakpoint = 640) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const c = () => setM(window.innerWidth < breakpoint);
    c();
    window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, [breakpoint]);
  return m;
}
```

Then in every screen:
```jsx
const isMobile = useIsMobile();
const padX = isMobile ? 12 : 100;
```

Use `padX` as horizontal padding everywhere.

---

## Reusable components (paste verbatim, then build screens on top)

### `Frac` — typographic fraction

```jsx
function Frac({ n, d, color, size = 'sm', style = {} }) {
  const sizes = {
    sm: 'clamp(16px, 2.5vw, 24px)',
    mid: 'clamp(26px, 5vw, 45px)',
    big: 'clamp(45px, 9vw, 88px)',
  };
  return (
    <span style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
      verticalAlign: 'middle', lineHeight: 1, margin: '0 0.08em',
      fontFamily: F.serif, fontSize: sizes[size],
      color: color || 'inherit', ...style,
    }}>
      <span style={{ padding: '0 0.12em' }}>{n}</span>
      <span style={{ height: '0.08em', background: 'currentColor', width: '100%', margin: '0.08em 0', borderRadius: 2 }} />
      <span style={{ padding: '0 0.12em' }}>{d}</span>
    </span>
  );
}

// Usage:
<Frac n="1" d="2" />                                        // small inline
<Frac n="3" d="6" size="mid" color={C.primary} />           // mid coloured
<Frac n="1" d={<span style={{color: C.primary}}>3</span>} />// only denominator coloured
```

### `AudioIndicator` — mute + replay buttons in the top chrome

```jsx
function AudioIndicator({ audio }) {
  const { isPlaying, muted, replay, toggleMute } = audio;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        onClick={toggleMute}
        title={muted ? 'Sound on' : 'Sound off'}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: 4, display: 'flex', alignItems: 'center',
          color: muted ? C.gray1 : (isPlaying ? C.primary : C.text),
        }}
      >
        {muted ? <VolumeX size={16} /> : isPlaying ? <Volume2 size={16} /> : <Volume1 size={16} />}
      </button>
      {!muted && (
        <button
          onClick={replay} title="Replay"
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: 4, display: 'flex', alignItems: 'center', color: C.gray1,
          }}
        >
          <RotateCcw size={14} />
        </button>
      )}
    </div>
  );
}
```

### `VideoStage` — full-viewport shell with progress + screen counter + audio chrome

```jsx
function VideoStage({ children, progress, kicker, screenIdx, totalScreens, audio }) {
  const isMobile = useIsMobile();
  const padX = isMobile ? 12 : 100;

  return (
    <div style={{
      height: '100vh', width: '100%',
      background: C.bg, color: C.text, fontFamily: F.sans,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Top chrome */}
      <div style={{ flex: '0 0 auto', background: C.bg, borderBottom: `1px solid ${C.gray2}` }}>
        <div style={{ height: 3, background: C.gray2 }}>
          <motion.div
            animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
            style={{ height: '100%', background: C.primary }}
          />
        </div>
        <div style={{
          padding: `12px ${padX}px`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{
            fontFamily: F.mono, fontSize: isMobile ? 10 : 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: C.gray1, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.primary }} />
            <span>{kicker}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {audio && <AudioIndicator audio={audio} />}
            <div style={{
              fontFamily: F.mono, fontSize: isMobile ? 10 : 11,
              color: C.gray1, letterSpacing: '0.1em',
            }}>
              {String(screenIdx + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
```

### `Btn` + `NavBar` — primary CTAs

```jsx
function Btn({ children, onClick, variant = 'primary', disabled = false, style = {} }) {
  const variants = {
    primary: { background: C.text, color: C.bg, border: `1.5px solid ${C.text}` },
    ghost:   { background: 'transparent', color: C.text, border: `1.5px solid ${C.text}` },
    accent:  { background: C.primary, color: '#fff', border: `1.5px solid ${C.primary}` },
  };
  return (
    <motion.button
      onClick={onClick} disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.96 }}
      whileHover={disabled ? {} : { background: C.primary, borderColor: C.primary, color: '#fff' }}
      style={{
        fontFamily: F.sans, fontWeight: 600,
        padding: 'clamp(12px, 2vw, 14px) clamp(18px, 2.5vw, 28px)',
        fontSize: 'clamp(14px, 1.8vw, 16px)',
        borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        ...variants[variant], ...style,
      }}
    >{children}</motion.button>
  );
}

function NavBar({ onBack, onNext, nextLabel, nextDisabled, extra }) {
  const isMobile = useIsMobile();
  const padX = isMobile ? 12 : 100;
  return (
    <div style={{
      flex: '0 0 auto', background: C.bg, borderTop: `1px solid ${C.gray2}`,
      padding: `${isMobile ? 14 : 18}px ${padX}px`,
      display: 'flex', gap: 12, alignItems: 'center',
    }}>
      {onBack && <Btn onClick={onBack} variant="ghost">← {isMobile ? '' : 'Orqaga'}</Btn>}
      {extra}
      <Btn onClick={onNext} variant="primary" disabled={nextDisabled} style={{ marginLeft: 'auto' }}>
        {nextLabel || 'Davom'} <ArrowRight size={16} />
      </Btn>
    </div>
  );
}
```

### `FeedbackBlock` — slide-in answer feedback

```jsx
function FeedbackBlock({ show, isCorrect, children }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            background: isCorrect ? C.green4 : C.redBg,
            borderLeft: `4px solid ${isCorrect ? C.green1 : C.primary}`,
            borderRadius: 12, padding: 'clamp(14px, 2.5vw, 20px)',
            overflow: 'hidden',
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### `MCScreen` — reusable multiple-choice question

This single component covers most question screens (s4, s8, s10, s11, s12, s13). Each option must have per-option wrong-answer feedback (`wrong_0`, `wrong_1`, ...).

```jsx
function MCScreen({
  screenIdx, lang, ttsApiBase, sfx, c, content, progress, totalScreens,
  storedAnswer, onAnswer, onNext, onBack, isFinal = false,
}) {
  const audioSegs = useMemo(() => [{
    id: 'q', text: content.audio_q, trigger: 'on_mount',
    waits_for: { type: 'option_picked' },
  }], [content.audio_q]);
  const audio = useAudio(audioSegs, c?.voice || 'f', ttsApiBase);

  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [revealed, setRevealed] = useState(storedAnswer !== undefined);

  const pick = (i) => {
    if (revealed) return;
    setPicked(i);
    setRevealed(true);
    audio.triggerEvent('option_picked');
    const correct = i === content.correctIdx;
    onAnswer(screenIdx, { picked: i, correct, type: 'mc' });
    // SFX immediately, then TTS feedback at ~400ms (SFX is short and finishes first)
    if (correct) sfx?.playCorrect?.(); else sfx?.playWrong?.();
    setTimeout(() => {
      const fb = correct
        ? content.correct_text
        : (content[`wrong_${i}`] || (lang === 'ru' ? 'Не совсем' : "Noto'g'ri"));
      // strip fraction notation so TTS reads it naturally
      audio.pushOneOff(fb.replace(/(\d+)\/(\d+)/g, (_, n, d) =>
        lang === 'ru' ? `${n} на ${d}` : `${n} bo'lingan ${d}`));
    }, 400);
  };

  const isMobile = useIsMobile();
  const padX = isMobile ? 12 : 100;

  return (
    <VideoStage progress={progress} kicker={c.kicker} screenIdx={screenIdx} totalScreens={totalScreens} audio={audio}>
      <div style={{
        flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: `${isMobile ? 20 : 40}px ${padX}px`, overflow: 'hidden',
      }}>
        <div style={{ width: '100%', maxWidth: 760, margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: F.serif, fontWeight: 600,
              fontSize: isMobile ? 22 : 'clamp(24px, 3.5vw, 36px)',
              lineHeight: 1.2, margin: '0 0 24px',
            }}
          >
            {content.question}
          </motion.h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {content.opts.map((opt, i) => {
              const sel = picked === i;
              const isC = i === content.correctIdx;
              let bg = '#fff', borderColor = C.text, color = C.text;
              if (revealed) {
                if (isC) { bg = C.green4; borderColor = C.green1; color = C.green1; }
                else if (sel) { bg = C.redBg; borderColor = C.primary; color = C.primary; }
                else { bg = '#fff'; borderColor = C.gray1; color = C.gray1; }
              }
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  whileTap={revealed ? {} : { scale: 0.99 }}
                  disabled={revealed}
                  onClick={() => pick(i)}
                  style={{
                    background: bg, border: `1.5px solid ${borderColor}`, color,
                    padding: 'clamp(14px, 2vw, 18px) clamp(16px, 2.5vw, 22px)',
                    borderRadius: 12, cursor: revealed ? 'default' : 'pointer',
                    fontFamily: F.sans, fontSize: 'clamp(15px, 1.9vw, 17px)', fontWeight: 500,
                    textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <span style={{
                    fontFamily: F.mono, fontSize: 13, minWidth: 20,
                    color: revealed && isC ? C.green1 : C.gray1,
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                </motion.button>
              );
            })}
          </div>

          <FeedbackBlock show={revealed} isCorrect={picked === content.correctIdx}>
            <p style={{
              margin: 0, marginBottom: 6, fontFamily: F.mono, fontSize: 12, fontWeight: 700,
              color: picked === content.correctIdx ? C.green1 : C.primary,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              {picked === content.correctIdx ? (lang === 'ru' ? 'Верно' : "To'g'ri")
                                              : (lang === 'ru' ? 'Не совсем' : "Noto'g'ri")}
            </p>
            <p style={{ margin: 0, fontSize: 'clamp(14px, 1.8vw, 16px)', lineHeight: 1.5 }}>
              {picked === content.correctIdx
                ? content.correct_text
                : (content[`wrong_${picked}`] || (lang === 'ru' ? 'Попробуй ещё раз.' : "Yana tahlil qiling."))}
            </p>
          </FeedbackBlock>
        </div>
      </div>

      <NavBar
        onBack={onBack}
        onNext={onNext}
        nextLabel={lang === 'ru' ? 'Дальше' : 'Davom'}
        nextDisabled={!revealed}
      />
    </VideoStage>
  );
}
```

A typical MC screen is then a thin wrapper:

```jsx
function ScreenMC({ screenIdx, lang, contentKey, ...rest }) {
  const c = CONTENT[lang][contentKey];
  const content = {
    kicker: c.kicker, question: c.question || c.title,
    opts: c.opts, correctIdx: c.correctIdx,
    correct_text: c.correct_text,
    wrong_0: c.wrong_0, wrong_1: c.wrong_1, wrong_2: c.wrong_2, wrong_3: c.wrong_3,
    audio_q: c.audio_q,
  };
  return <MCScreen screenIdx={screenIdx} lang={lang} c={c} content={content} {...rest} />;
}
```

---

## Screen patterns

### Hook (screen 0) — narrative scenario

The first screen must be a **concrete, provocative scenario**, not abstract theory. The student picks an answer; whatever they pick, the next screen explains why the obvious-looking answer is wrong. Curiosity before formula.

- The hook **counts as an answer** (record in `answers[0]`) but **no pick is "wrong"** — `Next` is enabled as soon as anything is picked
- Audio: greet by name, read the scenario aloud, wait for `option_picked`
- Render any inline math expression (e.g. "1/2 + 1/3 = 2/5") with `<Frac>`. Split the sub-text on the math substring and insert `<Frac>` between parts

Examples per topic:
- Fractions: "Madina pitsaning yarmini yedi. Zaynab uchdan birini. Birov shunday qo'shdi: 1/2 + 1/3 = 2/5. To'g'rimi?"
- Quadratic: "Tosh otdik, h(t) = -5t² + 10t. Birovi 2s, birovi 10s dedi. Kim haq?"
- Percentages: "Do'kon `30% + 30%` chegirma deydi. 60% bo'ladimi?"
- Trigonometry: "Daraxtga ko'tarilmasdan balandligini bilish — mumkinmi?"

### Analysis (screen 1) — step-by-step reveal

Uses local `step` state (0 → N) to progressively reveal bars / shapes / formulas. Audio segments are one-per-step, each `waits_for: { type: 'button_click', target: 'step' }`. The "Next" button advances both the step and the audio queue. On the last step the button advances to the next screen (`waits_for: { type: 'button_click', target: 'next' }`).

### Interactive (screen 2) — slider / picker

Student manipulates a control (`<input type="range">` with `accentColor: C.primary`) and sees a live visualization update. A "Check" button confirms — fires `audio.triggerEvent('check_pressed')` and shows a `FeedbackBlock` with success/failure text. `Next` is only enabled once the right value is confirmed.

### Concept (screen 3) — name the thing

Big serif italic title with the just-discovered concept in `C.primary`. A card panel shows the visual relation (e.g. `1/2  1/3  →  6 common denominator`). Audio plays the definition. One narration segment that `waits_for: { type: 'button_click', target: 'next' }`.

### Rule (screen 5) — 3-bullet recap

Three numbered cards (`01`, `02`, `03` in mono primary, item label in sans). Staggered entry with `delay: 0.15 * i`. Single audio segment that `waits_for: { type: 'button_click', target: 'next' }`.

### NumInput (screen 6) — typed answer

A typographic equation with an `<input type="number">` inline (styled as part of a `Frac`). Enter key or Check button submits. Borders + background turn green on correct, primary on wrong. **On submit, call `sfx.playCorrect()` or `sfx.playWrong()` immediately**, then push a one-off TTS feedback line at the ~300 ms mark. Use `audio_fb_correct` / `audio_fb_wrong` from CONTENT. NumInput accepts `sfx` in its props the same way `MCScreen` does.

### Full analysis (screen 7) — 4-step worked example

A `<div>` card containing 4 rows: `01 [step label] [math row with <Frac> elements]`. Single audio that narrates all 4 steps in one segment, waits for `next`.

### Case start (screen 9) — real-world scenario

A character (`{c.nameEm}` in serif italic primary) faces a problem. Card with body + hint. 3 mini-cards showing the relevant quantities (stakan, un, kakao / cup, flour, cocoa). Outro line with inline `<Frac>` expressions. Single audio, waits for `next`.

### Result (last screen) — cinematic finale

- Root has a gradient bg: passed = `linear-gradient(180deg, ${C.green4} 0%, ${C.bg} 60%)`, failed = `linear-gradient(180deg, #fff5f5 0%, ${C.bg} 60%)`
- Award badge (rotating 16-line corona around a `<Award>` icon) if passed; `<Sparkles>` if failed
- Big serif title with italic emphasis on a key word
- Hero `studentName` in serif italic, `clamp(20px, 3vw, 28px)`, green if passed / primary if failed
- Score panel: `correctCount / total` in `clamp(56px, 10vw, 96px)` serif, with message
- "Main points" card with the 4 takeaway bullets
- Finish CTA calls `onFinish` → triggers `onFinished` payload

**Exception:** the result screen may use `overflow: 'auto'` on the body if the mistakes list is long. Other screens must never scroll.

---

## Layout rules (recap)

- Every screen: `height: '100vh'`, `overflow: 'hidden'`. Flex column: top chrome (fixed) → body (`flex: 1, minHeight: 0`) → optional NavBar (fixed)
- Horizontal padding: `100px` desktop / `12px` mobile via `useIsMobile`
- Text blocks wrap in `maxWidth: 760` (or 800 for caption-heavy) and `margin: '0 auto'`
- SVGs: `viewBox` + `width: '100%'`, `height: 'auto'`, `maxWidth: 960`, `maxHeight: '100%'`
- Typography: `clamp(min, vw, max)` for everything that scales; explicit smaller sizes when `isMobile`
- Mobile (< 640px): single-column option grids, fonts down ~25%, gaps halved, icons 14px

When content genuinely won't fit 100vh:
1. Cut content / use shorter sentences
2. Shrink the SVG
3. Allow `overflow: 'auto'` on a single inner block (typically the caption or mistakes list)
4. Split into two sequential screens

Never let the whole stage scroll. The video metaphor breaks.

---

## Per-option wrong-answer feedback (mandatory)

Every MC question must define per-option explanations. Generic "Incorrect" is banned. The `MCScreen` above will look up `content[wrong_${picked}]` automatically.

```js
{
  question: '1/4 + 1/6 = ?',
  opts: ['2/10', '2/24', '3/12', '5/12'],
  correctIdx: 3,
  correct_text: '5/12! Umumiy mahraj 12, keyin 1/4 = 3/12 va 1/6 = 2/12.',
  wrong_0: '2/10 — suratlarni va mahrajlarni qo\'shgansiz. Bu noto\'g\'ri.',
  wrong_1: '2/24 — mahrajlarni ko\'paytirgansiz, 12 ham yetadi.',
  wrong_2: '3/12 — yaqin, lekin to\'liq emas. 1/6 ni ham qo\'shing.',
}
```

Wrong-answer text is also pushed to TTS (`audio.pushOneOff`) so the student hears why.

---

## Answer storage (mandatory)

The lesson is a multi-screen sequence and the student can navigate **backwards**. State that lives only inside a screen component dies when the screen unmounts. Answers must therefore be **stored in the parent lesson** and threaded back into each screen via a `storedAnswer` prop.

### Shape

The main lesson owns one object: `answers: { [screenIdx]: AnswerPayload }`.

```ts
type AnswerPayload = {
  picked: number | string,   // 0..3 for MC, the typed value for NumInput, etc.
  correct?: boolean,         // true/false for scored screens; absent for hook
  type: 'hook' | 'mc' | 'numinput' | 'slider',
};
```

### Recording an answer

In the main lesson:
```jsx
const [answers, setAnswers] = useState({});
const recordAnswer = (idx, payload) =>
  setAnswers(a => ({ ...a, [idx]: payload }));
```

This is the **only** writer of `answers`. Pass `recordAnswer` to every screen as `onAnswer`. Screens never own answer state across navigations.

### Reading on mount (every question screen)

Each screen receives `storedAnswer = answers[screenIdx]` and must **initialize its local state from it** so a back-navigation restores the exact view the student left:

```jsx
function MyQuestionScreen({ screenIdx, storedAnswer, onAnswer, ... }) {
  const [picked, setPicked]     = useState(storedAnswer?.picked ?? null);
  const [revealed, setRevealed] = useState(storedAnswer !== undefined);

  const pick = (i) => {
    if (revealed) return;          // already answered — ignore re-clicks
    setPicked(i);
    setRevealed(true);
    const correct = i === content.correctIdx;
    onAnswer(screenIdx, { picked: i, correct, type: 'mc' });
  };
  // ...
}
```

The `MCScreen` and `S6_NumInput` patterns above already do this — copy them verbatim instead of re-implementing.

### Rules of answer storage

- A screen **must not** call `onAnswer` more than once per visit unless the student explicitly re-tries (e.g. NumInput with a wrong answer where retry is allowed).
- A screen **must not** clear `answers[screenIdx]` on back navigation. The student's pick survives the round-trip.
- `revealed` is derived from `storedAnswer !== undefined`, not from a separate flag — keeps the source of truth in one place.
- The hook screen (`s0`) records `{ picked, type: 'hook' }` with **no `correct` field** — the hook has no wrong answer.
- Do not persist `answers` to `localStorage`/`sessionStorage` — the platform owns persistence; lessons are pure UI.

### Mistakes review on the result screen

The final result screen reads the full `answers` object and lists every wrong scored answer with the question text, the student's pick, and the correct answer. This is the payoff of storing answers — the student sees exactly what to revisit.

```jsx
function SN_Result({ lang, studentName, answers, onFinish }) {
  const scoredIdxs = [4, 6, 8, 10, 11, 12, 13]; // adapt per lesson
  const mistakes = scoredIdxs
    .map(i => ({ idx: i, a: answers[i], c: CONTENT[lang][`s${i}`] }))
    .filter(m => m.a && m.a.correct === false);

  return (
    <VideoStage /* ... */>
      {/* award / hero / score panel */}

      {mistakes.length > 0 && (
        <div style={{
          maxWidth: 640, width: '100%', marginTop: 16,
          display: 'flex', flexDirection: 'column', gap: 10,
          // Exception: this list may scroll if the student got many wrong
          maxHeight: '38vh', overflowY: 'auto',
        }}>
          <p style={{
            margin: 0, fontFamily: F.mono, fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: C.primary, fontWeight: 700,
          }}>
            {lang === 'ru' ? 'Что повторить' : "Nimani takrorlash"}
          </p>
          {mistakes.map((m) => (
            <div key={m.idx} style={{
              background: '#fff', border: `1.5px solid ${C.gray2}`,
              borderRadius: 12, padding: 14,
            }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                {m.c.question || m.c.title}
              </p>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: C.gray1 }}>
                {lang === 'ru' ? 'Ваш ответ' : 'Sizning javob'}:{' '}
                <span style={{ color: C.primary, textDecoration: 'line-through' }}>
                  {m.c.opts ? m.c.opts[m.a.picked] : String(m.a.picked)}
                </span>
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: C.gray1 }}>
                {lang === 'ru' ? 'Правильно' : "To'g'ri javob"}:{' '}
                <span style={{ color: C.green1, fontWeight: 600 }}>
                  {m.c.opts ? m.c.opts[m.c.correctIdx] : '—'}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* main takeaways + finish CTA */}
    </VideoStage>
  );
}
```

This is the only place a lesson is allowed to scroll inside a screen body — and only the mistakes list scrolls, not the entire stage.

---

## `studentName` usage — visual only, never in audio

**Hard rule:** `studentName` is for **visible text** only. It must never end up inside a string that is sent to TTS. TTS responses are cached by `sha256(text)` — putting the student's name in audio means every student gets a unique cache key, no one benefits from the cache, and ElevenLabs is hit fresh on every play. That's slow and costly.

**Visible text — required in at least 3 places:**
- Hook (screen 0): in the title — `Salom, ${name}!`
- Mid-lesson: at least once during a chapter or transition (e.g. a motivational kicker)
- Result: big serif italic at the top of the result panel

**Audio — always generic:**
- Greetings: `"Salom, do'st!"` / `"Привет, друг!"` — **not** `"Salom, ${name}!"`
- Farewells: `"Yakunlandi. Asosiy fikrlar..."` — **not** `"Yakun, ${name}..."`
- All `audio` / `audio_q` / `audio_fb_*` fields in `CONTENT` are **static strings**, never functions of the name.

**Resolve the visible-name fallback once** at the screen level and use the local variable for visual text only:

```jsx
const displayName = studentName || (lang === 'ru' ? 'Ученик' : "O'quvchi");
// VISIBLE — fine:
<h1>{c.title(displayName)}</h1>
<h2 style={{ fontStyle: 'italic' }}>{displayName}</h2>
// AUDIO — never use displayName:
const audio = useAudio([{ id: 'a', text: c.audio, trigger: 'on_mount', ... }], c.voice || 'm', ttsApiBase);
```

---

## `onFinished` payload

```js
const handleFinish = () => {
  const allAnswers = Object.entries(answers).map(([idx, a]) => {
    const sIdx = parseInt(idx);
    const c = CONTENT[lang][`s${sIdx}`];
    return {
      stage: sIdx === FINAL_IDX ? 'final' : (sIdx === 0 ? 'hook' : 'module-mikro'),
      questionIndex: sIdx,
      type: a.type,
      question: c?.question || c?.title || `Screen ${sIdx + 1}`,
      options: c?.opts,
      correctIndex: c?.correctIdx,
      correctAnswer: c?.correctIdx !== undefined ? c.opts?.[c.correctIdx] : undefined,
      studentAnswerIndex: typeof a.picked === 'number' && c?.opts ? a.picked : undefined,
      studentAnswer: c?.opts ? c.opts[a.picked] : String(a.picked),
      correct: a.correct || false,
    };
  });

  const scoredIdxs = [4, 6, 8, 10, 11, 12, 13];  // list the indexes that contribute to the score
  const correct = scoredIdxs.filter(i => answers[i]?.correct).length;
  const total = scoredIdxs.length;
  const finalCorrect = answers[FINAL_IDX]?.correct ? 1 : 0;
  const passed = correct >= total * 0.6;

  onFinished?.({
    lessonId: '[REPLACE: kebab-case-v1]',
    lessonTitle: lang === 'ru' ? '[Russian title]' : '[Uzbek title]',
    durationSec: Math.floor((Date.now() - startTime.current) / 1000),
    totalQuestions: total,
    correctAnswers: correct,
    scorePercent: Math.round((correct / total) * 100),
    finalScore: finalCorrect,
    finalTotal: 1,
    passed,
    answers: allAnswers,
  });
};
```

Use `const startTime = useRef(Date.now())` at the top of the main component.

---

## Quality bar

- Single self-contained `.jsx` file, 1500-2700 lines depending on topic complexity
- Every UI string in both languages (uz/ru)
- **Audio narration** via the HTTP TTS engine for every screen — natural sentences, no symbols. Sparingly use ElevenLabs audio tags (`[chuckle]`, `[pause]`, `[whispers]`, ...) for expressiveness — 0 to 2 per segment
- **SFX** via `useSfx` — every scored answer (MC, NumInput, AI-open) plays correct/wrong sound. Hook and info screens do NOT play SFX.
- **Hook screen** at start with concrete, provocative scenario
- **Per-option wrong feedback** for every MC question
- **1–2 AI-graded screens max** per lesson (optional but recommended for reflective topics). Pick `mode: 'text'` or `mode: 'voice'` per screen at authoring time — never both
- **storedAnswer persistence** — going back/forward preserves answers
- **Every screen fits 100vh — no internal scroll** (except optional `overflow: 'auto'` on the result screen's mistakes list)
- **Responsive padding**: `100px` horizontal on desktop, `12px` on mobile (via `useIsMobile`)
- Mobile-responsive: works at 360px width with no visual breakage
- Smooth 60fps animations using transforms, not layout properties
- Visual hierarchy clear: kicker > title > body > meta
- No external images, fonts (rely on fallback stack), or stylesheets

### Spinner CSS

For the AI grading "checking..." indicator, the `<Loader2>` icon needs to spin. Add this once near the top of the lesson file:

```jsx
// Inject minimal spinner keyframes once (only place CSS is allowed, for the AI loader)
if (typeof document !== 'undefined' && !document.getElementById('lesson-spin-kf')) {
  const s = document.createElement('style');
  s.id = 'lesson-spin-kf';
  s.textContent = '@keyframes lesson-spin{to{transform:rotate(360deg)}}.spin{animation:lesson-spin 1s linear infinite;display:inline-block;}';
  document.head.appendChild(s);
}
```

The `<Loader2 className="spin" />` usage in `OpenQuestionScreen` then rotates correctly. This is the **only** exception to the inline-styles rule, and only because keyframes can't be expressed inline.

---

## Anti-patterns (do not do)

- ❌ Don't use `window.speechSynthesis` or `SpeechSynthesisUtterance` — TTS is HTTP-only now
- ❌ Don't `fetch()` audio yourself — let the engine drive `<audio>` element via `src`
- ❌ **Don't hardcode `ttsApiBase`** — it MUST be read from the prop. No `const TTS_API_BASE = 'http://...'` in the file
- ❌ **Don't append `?text=` straight onto `ttsApiBase`.** It is a **base URL**, not the endpoint. Always go through `buildTtsUrl`, which adds the `/api/tts` path and the `text` + `g` params. Skipping the path produces `…/ms/lesson-runner?text=…` → **CORS / 404** (this was the v5.4 bug)
- ❌ **Don't send `lang`, `voice`, `mood`, or `provider` query params** — the server takes only `text` and `g`. Language comes from inline markers in `text`; voice/mood come from ElevenLabs tags in `text`
- ❌ **Don't add a `voiceGender` prop** — gender is not a prop. Choose it per screen via `CONTENT[lang].sN.voice` (default `'m'`); `buildTtsUrl` sends it as `g`
- ❌ **Don't hardcode `aiGradingEndpoint`, `correctSoundUrl`, or `wrongSoundUrl`** — same rule, read from props only
- ❌ **Don't include `studentName` in any audio text.** Audio is cached by `sha256(text)` — putting the name in the script breaks the cache and costs a fresh ElevenLabs call per student. All `audio` / `audio_q` / `audio_fb_*` fields are static strings; greet generically ("Salom, do'st!" / "Привет, друг!")
- ❌ Don't include `studentName` in AI `question` / `rubric` / `audio_q` either — same cache-friendliness principle
- ❌ Don't write audio scripts with `%`, `/`, `²`, `+`, `=`, `×` — TTS reads them poorly. Write words. (Square brackets `[...]` ARE allowed — they're audio tags / language markers, see §TTS quality rules)
- ❌ Don't over-tag audio — 0 to 2 ElevenLabs tags per segment, max. Tags like `[laughs]`, `[whispers]`, `[pause]` are accents, not decoration
- ❌ Don't open the lesson hook with `[laughs]` or `[laughs harder]` — first impressions need warmth, not comedy
- ❌ Don't invent new bracket tags. Use only the ones listed in §TTS quality rules table
- ❌ Don't use generic "Incorrect" feedback for MC questions — write per-option explanations (`wrong_0`, `wrong_1`, ...)
- ❌ Don't render BOTH text and voice inputs in the same AI screen — pick exactly one `mode` at authoring time
- ❌ Don't make an AI-graded screen the final test (s13) — the final test must be deterministic so the score is reliable. AI screens belong in mid-lesson positions (e.g. s9)
- ❌ Don't block lesson advance on AI failure — record `correct: null` and let the student move on
- ❌ Don't fire SFX on the hook screen or any info screen — only on scored answers
- ❌ Don't `fetch()` anything except via the provided `gradeAnswer` helper — that's the only allowed `fetch` in the lesson
- ❌ Don't skip the hook screen — every lesson needs a narrative scenario at the start
- ❌ Don't omit `storedAnswer` initialization — backwards-nav must restore previous picks
- ❌ Don't store answers in `localStorage`/`sessionStorage` or React context — keep the source of truth in the main lesson's `useState({})`
- ❌ Don't fire `onAnswer` more than once per screen visit unless the screen explicitly supports retries (e.g. NumInput)
- ❌ Don't use `minHeight: '100vh'` on a screen root — use `height: '100vh'` so it doesn't grow
- ❌ Don't let screens scroll vertically — content must fit 100vh (only the result-screen mistakes list may scroll)
- ❌ Don't use fixed pixel padding for horizontal — use `useIsMobile` (100/12)
- ❌ Don't constrain content to a narrow 720px column at root — use `maxWidth: 760` on inner wrappers only
- ❌ Don't use Tailwind classes, CSS classes, or `<style>` blocks — pure inline `style={{}}` only (one exception: the spinner keyframes block above)
- ❌ Don't use any colors outside the `C` palette
- ❌ Don't import any library not listed in the imports section
- ❌ Don't use `localStorage`, `cookies`, or any other `fetch` — lesson is pure UI plus the two allowed network calls (TTS GET, grading POST)
- ❌ Don't write `<img src="https://...">` or any hardcoded URL in JSX — media goes through `assets` + `assetsBase` + `resolveAssetUrl`, never inline. SVG is for diagrams the lesson generates itself; mentor-uploaded images/videos/audio go through the asset manifest.
- ❌ Don't hardcode `studentName = "Aziz"` — always use the prop
- ❌ Don't use TypeScript syntax
- ❌ Don't call `onFinished` more than once or before the student finishes
- ❌ Don't render the `MCScreen` outside `VideoStage` — every screen needs the chrome
- ❌ Don't forget `crossOrigin = 'anonymous'` on the TTS audio element (already in the engine block — don't remove it)

---

## Output

Reply with **only the complete `.jsx` file content**, no explanation before or after. Start with imports, end with the closing `}` of the default export. The file should compile cleanly with Babel-standalone + `@babel/preset-react`.

## PROMPT END

---

## Maslahatlar

### Qisqaroq dars uchun
Prompt oxiriga qo'shing:
> "Make this a shorter lesson — 8 screens total: hook, analysis, interactive, concept, 2 mikro, full-analysis, result. Target 8-10 minutes."

### Alohida brending
`C` paleti o'rnida o'z brendingiz ranglarini bering:
> "Replace the C palette with these brand colors: primary `#YOUR_HEX`, background `#YOUR_BG`, ... — keep the same key names but change the values."

### TTS ovozini o'zgartirish (gender)
Gender **dars ichida**, har bir ekran uchun tanlanadi — `CONTENT[lang].sN.voice` (`'f'` yoki `'m'`, default `'m'`). Prop YO'Q, `ttsApiBase` ichida ham YO'Q. `buildTtsUrl` uni `g` query param sifatida yuboradi. Bitta ekranda ikki personaj gapirsa, alohida audio segment'ga `gender` maydonini bering — u ekran default'ini bekor qiladi.

Server `lang`, `voice`, `mood`, `provider` parametrlarini qabul qilmaydi — faqat `text` va `g`. Tilni **ElevenLabs v3** matn ichidagi marker'lardan o'qiydi: har bir audio host til markeri bilan boshlanadi — `[O'zbekcha talaffuz]`, `[Русское произношение]`, inglizcha bo'laklar esa `[English pronunciation] ... [end]`. Ovoz va kayfiyat `text` ichidagi tag'lar (`[chuckle]`, `[pause]`, etc.) orqali boshqariladi. To'liq konvensiya — §"Language markers".

### TTS URL'ni o'zgartirish
`ttsApiBase` — bu **baza URL** (masalan `https://crm.junior-it.uz/ms/lesson-runner`), endpoint emas. Lesson o'zi `/api/tts?text=...&g=...` ni quradi (`buildTtsUrl` orqali). URL prop orqali keladi — lesson kodida hardcode qilmang. Junior-frontend uchun `VITE_TTS_API_BASE` env'da sozlanadi va `LessonRunnerQuestion` uni `LessonRunner`'ga, u esa dars komponentiga `ttsApiBase` prop sifatida uzatadi.

### Audio'siz rejim (offline / TTS down)
Agar `ttsApiBase` `undefined` bo'lsa, engine ovoz chiqarmaydi — lekin dars to'liq ishlashda davom etadi (tugmalar, javoblar, `onFinished` — barchasi normal). Lesson'ni hech qachon audio'ga bog'liq qilib qo'ymang: visual + tugma + matn yetarli bo'lishi shart.
