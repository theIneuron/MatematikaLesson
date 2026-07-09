# Trenajyor «Tez hisoblash» — pilotdan app darajasiga

> Maqsad: pilot trenajyorni (hozir `/trenajyor`, 1-sinf) to'laqonli, bolaning har
> kuni qaytadigan, o'sishini eslab qoladigan mashq-ilovasiga aylantirish —
> **platforma ichida**, alohida store-app emas. Bu hujjat kelishilgach kod yoziladi.
>
> Holat: **REJA (kod emas)**. Pilot allaqachon push qilingan (`src/components/trenajyor/`).
> Sana: 2026-07-09.

---

## 0. «App darajasi» nimani anglatadi

Pilot = bir sessiya, bir rekord, xotira yo'q. App = quyidagilar bor:

1. **Progres eslab qolinadi** — bola qaytganda o'z darajasi, striki, tarixi joyida.
2. **Shaxsiylashgan** — har bolaga o'z zaif joyi bo'yicha mashq beriladi, hammaga bir xil emas.
3. **Qaytishga sabab bor** — kunlik topshiriq, strik, nishonlar.
4. **Bir nechta rejim** — faqat 60s poyga emas.
5. **Kurrikulumga bog'langan** — faqat o'tilgan mavzular haydaydi.
6. **Kattalar ko'radi** — ota-ona/o'qituvchi progres hisoboti.
7. **App his qilinadi** — PWA (o'rnatiladi, offline, to'liq ekran).

Doira cheklovi: bularning hammasi **platforma ichida** ishlaydi. Ba'zi qismlar
(akkaunt-saqlash, ota-ona paneli, production ovoz) backend/platforma
qo'llab-quvvatlashini talab qiladi — ular Fuzail + dasturchi qarori (§8).

---

## 1. Ko'nikma xaritasi (1-sinf) — poydevor

Trenajyorning yuragi — **mikro-ko'nikmalar** ro'yxati. Hozir kod «add/sub/count/…»
bilan cheklangan; app-level har ko'nikmani alohida kuzatadi va darsga bog'laydi.

| Kod | Ko'nikma | Rejim | Ochiladi (dars) |
|---|---|---|---|
| S1 | 100 gacha sanash / son tanlash | raqam | Dars 01–07 |
| S2 | Taqqoslash `< = >` | tap | Dars 04 |
| S3 | Son tarkibi (7 = 4 + ?) | raqam | Dars 06 |
| S4 | Ketma-ketlik / qonuniyat davomi | raqam | Dars 05 |
| A1 | 10 ichida qo'shish | raqam | Dars 08 |
| A2 | 10 ichida ayirish | raqam | Dars 09 |
| A3 | 20 ichida (o'nlikdan o'tmasdan) | raqam | Dars 15 |
| A4 | O'nlikdan o'tib qo'shish (8 + 5) | raqam | Dars 18 |
| A5 | O'nlikdan o'tib ayirish (12 − 5) | raqam | Dars 20 |
| A6 | 100 ichida o'nliklar (20 + 30) | raqam | Dars 21 |
| A7 | Yetishmagan qism (a + ? = c) | raqam | Dars 16 |
| G1 | Shakllarni sanash | raqam | Dars 32 |
| G2 | Ortiqchani top | tap | Dars 33 |
| G3 | Naqsh / qonuniyat (shakl) | tap | Dars 33 |

> Dars raqamlari — **draft**, 1-sinf dastur bo'yicha aniqlashtiriladi (metodist).
> Prinsip: bola darsni o'tmaguncha, o'sha ko'nikma trenajyorda chiqmaydi
> ([test-numbers-in-scope] qoidasining app miqyosi).

Har ko'nikma uchun generator scope'ni biladi (sonlar diapazoni, столбiksiz).

---

## 2. Adaptivlik modeli

Hozir daraja **global** (10→20→100). App-level: **har ko'nikma alohida**.

- Har ochiq ko'nikmada `mastery` (0–1) va `daraja` (1–3) kuzatiladi.
- Sessiyada savol tanlash **vazn** bilan: zaif (past mastery) ko'nikmalar ko'proq,
  mustahkamlari kamroq, lekin **interval takrorlash** — mustahkam ko'nikma ham
  vaqti-vaqti bilan qaytadi (unutilmasin).
- To'g'ri + tez → mastery ↑, daraja oshishi mumkin. Xato → mastery ↓, o'sha
  ko'nikma tez orada yana beriladi.
- Yangi ochilgan ko'nikma past darajadan boshlanadi (bola cho'chimasin).

Sessiya oxirida bola ko'radi: **«Qo'shishda kuchlisan · O'nlikdan o'tib ayirishni
mashq qil»**. Bu — «xato — material» tamoyili (jazolamaydi, yo'naltiradi).

---

## 3. Progres va persistensiya

**Data shakli (bitta o'quvchi):**
```json
{
  "xp": 1240,
  "streak": { "count": 5, "lastDate": "2026-07-09" },
  "best": { "points": 310, "correct": 22, "mode": "timeAttack" },
  "skills": {
    "A4": { "mastery": 0.4, "level": 2, "seen": 30, "correct": 18, "lastSeen": "..." }
  },
  "history": [ { "date": "...", "mode": "...", "points": 0, "correct": 0 } ],
  "badges": ["streak7", "first100"]
}
```

- **Pilot / Faza 1–2:** `localStorage` (bir qurilma). Adapter orqali.
- **Faza 3 (app):** aynan shu shakl **platforma akkaunti** bo'yicha serverda saqlanadi
  → qurilmalar orasida sinxron, ota-ona ko'radi. **Backend kerak** (§8).
- Kod bir **storage adapter** interfeysiga yozadi (`load()/save()`), shунда
  `localStorage` → server almashtirilishi bitta modul o'zgarishi bo'ladi.

---

## 4. Rejimlar

| Rejim | Tavsif | Taymer |
|---|---|---|
| **Poyga** (bor) | 60 s, imkon qadar ko'p to'g'ri, rekord = ball | Global 60s |
| **Mashq** | Bosimsiz, taymersiz, xohlagancha; zaif ko'nikmaga fokus | Yo'q |
| **Kunlik topshiriq** | Har kuni yangi to'plam (masalan 15 misol); strikni oziqlantiradi | Yumshoq |
| **Mavzu fokusi** | Faqat bitta ko'nikma (masalan «faqat ayirish» / «faqat shakl») | Ixtiyoriy |
| **Xatolar ustida** | O'tgan sessiyalardagi adashgan misollar qayta beriladi | Yo'q |

«Mashq» va «Xatolar ustida» — pedagogik yadro: bosim yo'q, o'rganish bor.
«Kunlik» va «Poyga» — qaytish/motivatsiya.

---

## 5. Motivatsiya (ota-onaga sezgir)

- **Kunlik strik** 🔥 — ketma-ket kunlar. App hissining eng kuchli vositasi.
- **Nishonlar (achievements)** — boshlang'ich to'plam: `7 kun strik`, `100 to'g'ri`,
  `birinchi rekord`, `zaif ko'nikmani yengish`, `barcha shakllar`, `tez o'q` (tezlik).
- **XP / daraja** — umumiy o'sish hissi.
- **Avatar / ochiladigan bezaklar** — keyinroq, ixtiyoriy.
- **REYTING YO'Q.** Boshqa bolalar bilan taqqoslash — ota-ona sezgirligi va
  «jazolovchi baholash yo'q» tamoyili sabab **qilinmaydi**. Faqat shaxsiy o'sish.

---

## 6. Ota-ona / o'qituvchi paneli (Faza 3)

Qisqa hisobot: necha kun mashq qildi, umumiy vaqt, qaysi mavzu kuchli/zaif,
strik. O'zbekistonda ed-product uchun «app-level» aynan shu — kattalar natijani
ko'radi. **Backend + platforma rol-tizimi kerak** (§8).

---

## 7. Texnik arxitektura — qayta ishlatiladigan engine

Maqsad: 1-sinfga yozilgan narsa 2, 5-sinfga config bilan kengaysin, noldan emas.

Taklif etilgan struktura (`src/components/trenajyor/`):
```
engine/
  skills.js      // ko'nikma konfiglari + generatorlar (§1), scope-aware
  adaptive.js    // savol tanlash + mastery yangilash (§2)
  session.js     // sessiya yurituvchi (rejimga qarab, §4)
  progress.js    // storage adapter (localStorage ↔ platforma, §3)
  badges.js      // nishon qoidalari (§5)
ui/
  Intro / Play / Summary / ModeSelect / ...   // ekranlar
Trenajyor.jsx    // qobiq: lang, student-id, rejim marshruti
```

**Platforma kontrakti:** komponent `lang` (bor) + `studentId`/`profile` propларини
oladi; sessiya tugagach platforma-ga `onProgress(payload)` beradi
(`platform_contract`ga mos, LMS payload uslubida). Bu productionда akkaunt-saqlashни
ulaydi.

Config-driven bo'lgani uchun yangi sinf = yangi `skills` konfig + darsga bog'lash,
UI/engine o'zgarmaydi.

---

## 8. Platforma / backend bog'liqliklari (Fuzail + dasturchi)

Front tomonini men appga tayyor qilaman, lekin quyidagilar platforma tomonini talab qiladi:

1. **Akkaunt bo'yicha progres-saqlash** (§3, Faza 3) — server API yoki platforma
   storage. Bo'lmasa, `localStorage` bir qurilma bilan cheklangan.
2. **Ota-ona/o'qituvchi paneli** (§6) — backend + rollar.
3. **Production ovoz** — hozir trenajyor jimjit (metodist qarori). Agar keyin ovoz
   qo'shilsa — Yandex SpeechKit / ElevenLabs, **Fuzail qarori** (odatdagi, Web Speech emas).
4. **PWA** (§9) — agar trenajyor katta platformaning bir qismi bo'lsa, PWA
   platforma darajasida sozlanadi, komponent darajasida emas — dasturchi bilan aniqlash.
5. **Analitika** — qaysi ko'nikma ko'p adashtiradi (kontentni yaxshilash uchun) —
   platforma analitika tizimiga ulash.

---

## 9. «App» hissi — PWA va polish

- **PWA:** bosh ekranga o'rnatiladi, offline ishlaydi, to'liq ekran, ikonka.
  Platformadan chiqmasdan «haqiqiy app» ko'rinishi (§8.4 caveat).
- **Onboarding:** birinchi marta — 2–3 ekran qisqa tanishtiruv.
- **Ixtiyoriy SFX** (TTS emas): to'g'ri/xato uchun kichik tovushlar, o'chirish
  tugmasi bilan. *Diqqat:* bu «ovoz» degani emas — TTS ovoz Fuzail qarori (§8.3).
- **Mobil haptik** — javobda yengil tebranish (qo'llab-quvvatlansa).

---

## 10. Bosqichli yo'l xaritasi

| Faza | Mazmun | Bog'liqlik |
|---|---|---|
| **0 — Pilot** ✅ | 60s poyga, hajmli figuralar, RU/UZ, localStorage rekord | — (bajarildi) |
| **1 — Poydevor** | engine refaktor · ko'nikma xaritasi (§1) · per-skill adaptivlik (§2) · localStorage progres (§3) · sessiya xulosasi | Front-only |
| **2 — App hissi** | rejimlar (§4) · kunlik strik + nishonlar (§5) · PWA + onboarding (§9) | Front-only |
| **3 — Platforma** | akkaunt-persistensiya · ota-ona paneli · cross-device | **Backend kerak** |
| **4 — Kengayish** | 2 va 5-sinf engine orqali · (ixtiyoriy) production ovoz | Fuzail + metodist |

Faza 1 va 2 to'liq front-only — men mustaqil qura olaman. Faza 3 dan backend kerak.

---

## 11. Ochiq savollar (metodist)

1. **Ko'nikma xaritasi (§1)** — dars-bog'lanishlar draft. 1-sinf dasturi bo'yicha
   tasdiqlaysizmi yoki tuzatasizmi?
2. **Rekord metrikasi** — headline **ball**mi (tezlik + to'g'ri) yoki sof **to'g'ri
   soni**mi? (Oldin «bilmadim» dedingiz — Faza 1 da hal qilish kerak.)
3. **Rejimlar (§4)** — beshtasi ham kerakmi, yoki boshlash uchun qaysilari?
4. **Nishonlar ro'yxati (§5)** — boshlang'ich 6 tasi mos keladimi?
5. **Faza 3 (backend)** — Fuzail bilan qachon gaplashamiz? Undan oldin Faza 1–2 ni
   localStorage bilan to'liq qilib qo'yamizmi?

Kelishilgach, Faza 1 dan boshlaymiz.
