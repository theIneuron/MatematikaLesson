# Mobil + Desktop moslash — instruksiya (dars .jsx fayllari uchun)

> Maqsad: **desktopda hech narsa o'zgarmaydi**, **mobilda (<640px) butun urok bir xil
> masshtabda moslashadi**, va **paydo bo'lgan kontentga avtoskroll** bo'ladi.
> 2026-07-03/04 da barcha 36 ta 1-sinf darsiga qo'llangan. Yangi darslar va boshqa
> sinflarga (grade5 va h.k.) ham shu naqsh bo'yicha qo'llanadi.
> Etalon fayl: `src/components/grade1/Dars28.jsx`.

---

## Asosiy g'oya

Har dars faylida ~300 ta `clamp()` bor — har element o'zicha kichrayadi, natijada
360px va 430px telefonda proporsiyalar har xil chiqadi. Buning o'rniga:

- **≥640px** — hech narsa o'zgarmaydi (`--g1z=1`, `.stage` 936px markazda).
- **<640px** — butun urok **390px etalon kenglikda** joylashadi va real ekranga
  `zoom` bilan **fotografik masshtablanadi**. Barcha telefonlarda aynan bir xil
  ko'rinish; QA faqat 390px da qilinadi.

`transform: scale` EMAS, aynan **`zoom`** — chunki `zoom` layout'ga kiradi:
sticky-tugmalar, flex-ustun, pointer-koordinatalar ishlashda davom etadi
(`transform` ichida sticky sinadi).

Telefonda "Davom" tugmasi skroll bo'lib qolgan bag'ning ildizi: host
(`LessonPage`/LMS) `min-height:100vh` bilan URL-panel tufayli ko'rinadigan
ekrandan baland bo'lib **body-skroll** yaratardi, tugma u bilan siljirdi. Yechim —
`.lesson-root { position: fixed; inset: 0 }`: dars oqimdan chiqib, doim aynan
ko'rinadigan viewport'ga mixlanadi.

---

## Har darsga 8 ta o'zgarish (EDIT 1–8)

Fayllar ~300KB — kerakli joyni Grep bilan top, Read bilan aniq matnni o'qi
(satr-oxiri CRLF bo'lishi mumkin), keyin Edit qil.

### EDIT 1 — `useMobileZoom` hook (`class AudioEngine {` OLDIGA)

```js
// ============================================================
// useMobileZoom — mobil yagona masshtab qatlami (etalon kenglik 390px).
// <640px: butun urok 390px kenglikda joylashadi va real ekranga zoom bilan
// fotografik masshtablanadi — barcha telefonlarda BIR XIL ko'rinish, QA faqat
// 390px da. Desktop (>=640px): --g1z=1, hech narsa o'zgarmaydi.
// Balandlik JS'da o'lchanmaydi: .lesson-root position:fixed + inset:0 —
// brauzer viewport o'zgarishini (URL-panel) o'zi kuzatadi.
// ============================================================
const MOBILE_DESIGN_W = 390;
function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const apply = () => {
      const z = window.innerWidth < breakpoint ? window.innerWidth / MOBILE_DESIGN_W : 1;
      root.style.setProperty('--g1z', String(z));
    };
    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
      root.style.removeProperty('--g1z');
    };
  }, [breakpoint]);
}
```

### EDIT 2 — avtoskroll yordamchilari (`const FeedbackBlock = (` OLDIGA)

```js
// autoScrollTo — yangi paydo bo'lgan kontentni ko'rinish zonasiga olib keladi.
// 'nearest' — element ko'rinib turgan bo'lsa sakramaydi; reduced-motion'da silliqsiz.
const autoScrollTo = (el, block = 'nearest') => {
  if (!el || typeof el.scrollIntoView !== 'function') return;
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block });
};

// useRevealScroll — active=true bo'lganda (kontent paydo bo'lganda) unga avtoskroll.
// FeedbackBlock naqshi: double-rAF + kechikish (fade-up animatsiyasi joylashgach).
function useRevealScroll(active, delay = 350, block = 'nearest') {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    let tid;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      tid = setTimeout(() => autoScrollTo(ref.current, block), delay);
    }));
    return () => { cancelAnimationFrame(raf); clearTimeout(tid); };
  }, [active, delay, block]);
  return ref;
}
```

### EDIT 3 — `.lesson-root` CSS (STYLES ichida)

Eski blok (`height: 100dvh; overflow: hidden; position: relative;`) shu bilan
almashtiriladi:

```css
/* position: fixed + inset: 0 — dars oqimdan chiqib, doim aynan KO'RINADIGAN
   viewport'ga mixlanadi. Host (LessonPage/LMS) 100vh bilan balandroq bo'lsa ham
   body-skroll darsga ta'sir qilmaydi, "Davom" tugmasi joyidan siljimaydi.
   URL-panel ochilib-yopilganda balandlikni brauzer o'zi kuzatadi (JS o'lchovsiz). */
.lesson-root {
  font-family: 'Manrope', system-ui, sans-serif;
  color: #0E0E10;
  background: #F6F4EF;
  position: fixed;
  inset: 0;
  overflow: hidden;
  overscroll-behavior: none;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
  zoom: var(--g1z, 1);
}
/* Mobil yagona masshtab (useMobileZoom): layout doim 390px, zoom real ekranga
   moslaydi — barcha telefonlarda aynan bir xil ko'rinish. Desktop tegilmaydi. */
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
}
```

### EDIT 4 — `.stage` balandligi

`.stage { max-width: 936px; margin: 0 auto; height: 100dvh; ... }` satrida
`height: 100dvh;` → `height: 100%;` (qolgani o'zgarmaydi).

### EDIT 5 — `.stage-content` skroll-zanjir

`.stage-content { ... }` bloki ichida `overflow-x: hidden;` dan KEYIN yangi satr:

```css
  overscroll-behavior: contain;
```

### EDIT 6 — root komponentda hook chaqiruvi

`const isPreview = (langProp === undefined || langProp === null);` OLDIGA yangi satr:

```js
  useMobileZoom();
```

### EDIT 7 — drag-arvoh (`g1-ghost`) koordinatalari

Zoom ostida pointer-koordinatalar `--g1z` ga bo'linishi kerak. Eski:

```jsx
<div className="g1-ghost" style={{ left: dnd.drag.x, top: dnd.drag.y }}>
```

Yangi:

```jsx
<div className="g1-ghost" style={{ left: `calc(${dnd.drag.x}px / var(--g1z, 1))`, top: `calc(${dnd.drag.y}px / var(--g1z, 1))` }}>
```

> Faylda 1 yoki 2 ta bo'lishi mumkin — hammasini almashtir. Drag yo'q darslarda
> (`left: dnd.drag.x` topilmasa) bu edit tushib qoladi — normal.

### EDIT 8 — avtoskrollni ulash (fayl bo'yicha mulohaza talab qiladi)

**Qoida:** avtoskroll faqat foydalanuvchi **TAP/JAVOBI natijasida** paydo bo'ladigan
bloklarga ulanadi. Sof vaqt/audio bilan ochiladigan qoida-animatsiyalariga,
`FeedbackBlock` ichki skrolliga va mount-paytdagi summary bloklariga **ulanmaydi**.

Naqshlar:

1. **Exploration success-blok** (`{solved && (<div className="frame-success fade-up">`
   yoki `{done && (...)}`): komponent boshiga
   `const revealRef = useRevealScroll(solved);` (yoki `done`) qo'shib, div'ga
   `ref={revealRef}`. Agar javob setTimeout bilan kechikib materiallashsa,
   delay'ni moslashtir: `useRevealScroll(done, 1050)` (950ms reveal uchun).
2. **Mini-game** (`solvedItem` success-bloki):
   `const revealRef = useRevealScroll(solvedItem);` + ref. Faylda 2 ta o'yin
   komponenti bo'lishi mumkin — ikkalasiga ham.
3. **QuestionScreen/MCScreen fakt-kartochka** (`{solved && factOnCorrect}`):
   `const factRef = useRevealScroll(solved && !!factOnCorrect, 900);` (900ms —
   FeedbackBlock skrollidan keyin), render:
   `{solved && factOnCorrect && <div ref={factRef}>{factOnCorrect}</div>}`.
4. **ChainTest** (bir slaydda ko'p savol): yangi savol ochilganda uni ko'rinishga
   olib kelish — chain-advance state'iga `useRevealScroll` (Dars32/33 ga qara).
5. Bir komponentda bir nechta blok bo'lsa: `revealRef`, `revealRef2`, ... deb nomla.

---

## Host tomonidagi tuzatish (bir marta)

`src/components/shared/LessonPage.css` da body-skrollni oldini olish uchun:

- `.lesson-page { min-height: 100vh; }` → `min-height: 100dvh;`
- `.lesson-frame { min-height: 100vh; }` → `min-height: 100dvh;`

---

## Tekshiruv

**Bitta fayl (rollout paytida, `vite build` ISHLATMA — parallel agentlar bilan urishadi):**

```
npx esbuild src/components/grade1/DarsNN.jsx --loader:.jsx=jsx --outfile=NUL
```

`Done` chiqishi kerak. Xato bo'lsa darhol tuzat.

**Yakuniy (hammasi tugagach):**

- `npx vite build` — yashil bo'lishi kerak.
- Marker skani (har fayl bir xil bo'lishi kerak): `function useMobileZoom` = 1,
  `position: fixed;` = 2, `height: 100dvh;` = 0, `.stage ... height: 100%` = 1,
  `useMobileZoom();` = 1, `useRevealScroll(` ≥ 4, `left: dnd.drag.x` (eski) = 0.
- Stray-Cyrillic tekshiruvi: `revealRef`/`factRef` zonasida kirill harf bo'lmasin.
- Playwright cross-avlod (masalan Dars05/11/17/32), 360×600 mobil:
  - `--g1z` = viewport / 390, root kengligi 390px,
  - host'ni `minHeight:150vh` qilib body'ni skroll qilganda `.stage-nav` pastki
    qirrada mixlangan (navBottom == innerHeight),
  - gorizontal overflow yo'q, `pageerror` = 0;
  - desktop 1440: `--g1z=1`, `.stage` kengligi 936px (regressiya yo'q).

---

## Muhim eslatmalar

- **iOS Safari** da `zoom` + `position: fixed` kombinatsiyasi real qurilmada
  alohida tekshirilishi kerak (Android Chrome ishonchli). Agar Safari'da pastda
  bo'shliq yoki o'lcham g'alatiligi bo'lsa — bu joyni qayta ko'rish kerak.
- Ovoz/TTS ga bu o'zgarishlar **umuman tegmaydi**. Saytda ovoz qurilmaga qarab
  boshqacha eshitilsa — sabab: host (`LessonPage`) darsni `ttsApiBase`siz
  chaqiradi → AudioEngine brauzer Web Speech API'siga tushadi, u qurilmaning
  tizim ovozlarini ishlatadi. Haqiqiy LMS'da `ttsApiBase` bilan server TTS
  (Yandex/ElevenLabs) — u har qurilmada bir xil.
- `FREE_NAV` bu naqshdan mustaqil; push oldidan alohida `false` qilinadi.
