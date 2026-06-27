# SYUJET BIBLIYASI — 1-sinf, Dars 1–23 (umumiy hikoya kontrakti)

> **Bu hujjat — yagona haqiqat manbai (single source of truth) butun 1-sinf
> syujeti bo'yicha.** Darslar PARALLEL, hatto IKKI XIL KOMPDA yaratilganda ham,
> har bir dars shu yerdagi *kirish holati* va *chiqish holati* matnlaridan kelib
> chiqadi. Hech bir komp syujet o'tishini O'ZI O'YLAB TOPMAYDI — u shu hujjatdan
> ko'chiriladi. Aks holda hikoyalar bir-biriga zid keladi.
>
> Spec/dizayn: `ETALON_1SINF.md`. Matematik mavzular: `Matematika_1sinf_35_dars_kontent.md`.
> Bu hujjat — faqat HIKOYA qatlami (matematikani belgilamaydi, faqat unga sahna beradi).

---

## 0. ISH TARTIBI (parallel + ikki komp)

1. **Bu hujjat — o'qiladi, O'ZGARTIRILMAYDI** dars yaratish paytida. U faqat
   bitta joyda (kelishilgan holda) yangilanadi. Ikkala komp ham aynan shu
   faylning bir xil nusxasidan o'qiydi (git orqali sinxron).
2. Har dars o'z "syujet uyasi"ni (§3 jadval) to'ldiradi:
   - `sIntro` ekrani — **kirish holati** matnidan boshlanadi (o'tgan darsga ulaydi).
   - `sGuest` ekrani (final oldidan ko'prik) — **chiqish holati**ga olib chiqadi.
3. **Chegaralarni buzmaslik:** dars o'ziga ajratilgan kirish va chiqish holati
   orasida qoladi. Keyingi darsning voqealarini boshlab yubormaydi, o'tgan darsni
   qayta hikoya qilmaydi (faqat bitta jumlalik ulama: "O'tgan safar biz …").
4. **Komp chegarasi (chok):** Komp1 = Dars 3–12, Komp2 = Dars 13–23. Dars12→Dars13
   o'tishi §4 da so'zma-so'z qotirilgan. Komp2 Dars13 ni AYNAN shu chiqish
   holatidan boshlaydi, garchi Komp1 ning kodini ko'rmasa ham.

---

## 0.1. NAVIGATSIYA BLOKIROVKASI (FREE_NAV) — har dars uchun majburiy

Har dars `.jsx` faylida `FREE_NAV` konstantasi bor (ETALON §8). U slayd-gating'ni
boshqaradi: `false` — o'quvchi audio tugamaguncha "davom"ni bosolmaydi (production);
`true` — barcha ekranlar ochiq (faqat test/prokliklash uchun).

**Qoida (har darsda):**
1. **Yaratish/test paytida** — vaqtincha `FREE_NAV = true` qilib, butun darsni
   tez prokliklab tekshiring.
2. **PUSH oldidan — ALBATTA `FREE_NAV = false` ga qaytaring.** Aks holda
   productionda o'quvchi ekranlarni o'tkazib yuboradi (audio tinglamasdan).
3. Push'dan oldin tekshiring: `Dars*.jsx` da birorta `FREE_NAV = true` qolmasin.

> **Avtomatik to'siq (tavsiya):** ikkala kompga `.git/hooks/pre-push` o'rnatiladi —
> u push paytida `FREE_NAV = true` ni topsa, push'ni rad etadi. Inson eslamasa ham,
> mashina to'xtatadi. (Qoida faqat hujjatda turса — buziladi: tekshiruvda topilgan
> misol — `Dars02.jsx` test'dan keyin `true` da qolib ketgan edi.)

---

## 1. O'ZAK G'OYA

Ra'no va uning do'sti Anvar — bitta mahallada yashaydi. Har dars — ularning
hayotidan **bitta kichik epizod** (mehmon, bozor, maktabga tayyorgarlik, sayr).
Matematik mavzu shu epizod ichidagi tabiiy vazifaga to'qiladi. **Sonlar
kattalashgani sari dunyo kengayadi:** uy ichi → ko'cha → mahalla/bozor →
maktab → shahar. Bit — boshlovchi/diktor (3-shaxsda, bitta erkak ovoz), har
darsni o'tgan darsga ulab ramkalaydi.

**O'zgarmas qoidalar (canon):**
- Ra'no — syujet yetakchisi; Anvar — uning do'sti/mehmoni.
- Bit — syujetdan tashqarida, faqat hikoya qiladi (personajlar o'z ovozi bilan
  gapirmaydi).
- Joy — bitta mahalla. Sahnalar `room` (uy ichi) / `door` (ko'cha-eshik) +
  yangi zonalar kengayganda qo'shiladi.
- Ismlar — har doim o'zbekcha. Register: RU `ты`, UZ `siz` (ETALON §5).
- Hech qaysi dars o'lim/qo'rquv/raqobat-yutqazish kabi keskin syujet bermaydi —
  yumshoq, do'stona ton (1-sinf).

---

## 2. PERSONAJLAR VA ULAR QACHON KIRADI

| Personaj | Roli | Kiradi | SVG |
|---|---|---|---|
| **Ra'no** | Syujet yetakchisi | Dars01 (bor) | `RanoSVG` |
| **Anvar** | Do'st/mehmon | Dars01 (bor) | `AnvarSVG` |
| **Bit** | Boshlovchi/diktor | Dars01 (bor) | `BitSVG` |
| **Zaynab** | Yangi do'st — guruhga qo'shiladi | **Dars 7** (qo'shish mavzusi: "yana bir do'st qo'shildi" — amal bilan rezonans) | YANGI SVG chiziladi |
| **Bekzod** | Yangi do'st — maktab/mahalla bosqichida | **Dars 13** (o'nlik, dunyo maktabga kengayadi) | YANGI SVG chiziladi |

Yangi personaj kirganda (ETALON §0): (1) yangi SVG mavjudlari uslubida chiziladi,
(2) CONTENT'da ism + `*_label` (RU+UZ), (3) syujetga mantiqan ulanadi — kirish
holatida tabiiy sabab bilan paydo bo'ladi.

---

## 3. SYUJET UYALARI — har dars uchun kirish/chiqish holati

Har qatorda: **joy/sahna**, **kirish holati** (sIntro qayerdan boshlanadi),
**chiqish holati** (sGuest/yakun qayerga yetadi). Matn — yo'naltiruvchi, dars
yaratuvchi shu ma'noni RU+UZ qilib yozadi (so'zma-so'z emas, lekin chegara aynan shu).

### ZONA A — Uy va ko'cha (Dars 1–6 · sonlar/tarkib 10gacha)

| № | Mavzu | Joy | Kirish holati | Chiqish holati |
|---|---|---|---|---|
| 1 | Sanash 1–5 | uy ichi | Ra'noning uyi, alohida kun; Anvar mehmonga keladi | Anvar keldi, 5 olmali savat sovg'a qilindi *(BOR)* |
| 2 | Raqamlar 1–5 | ko'cha | Anvar Ra'noning ko'chasidagi raqamli uylarni qidiradi | 5-uy topildi, Anvar manzilga yetdi *(BOR)* |
| 3 | Sonlar 6–10 va 0 | hovli/ko'cha | Mehmon kutilmoqda — hovlida buyumlar ko'p (6–10), bitta uy/savat **bo'sh** (0) | Hammasi sanaб chiqildi; bo'sh joy = 0 ekani tushunildi |
| 4 | Taqqoslash 10gacha (> < =) | ikki hovli/savat | Ikki do'stda turli miqdorda narsa bor — qaysi biriga ko'p? | "Ko'p / kam / teng" aniqlandi, adolatli bo'lindi |
| 5 | Son tarkibi 2–5 (uychalar) | "son uychalari" | Har sonning o'z uychasi bor — ichida ikki xona; kim qaysi xonada? | 2–5 sonlari ikki bo'lakka ajraladi (uycha to'ldi) |
| 6 | Son tarkibi 6–10 (uychalar) | "son uychalari" | Kattaroq uychalar (6–10) ham to'ldirilishi kerak | 6–10 tarkibi yig'ildi; sonlar mahkamlandi |

### ZONA B — Mahalla / bozor (Dars 7–12 · qo'shish-ayirish 10gacha)

| № | Mavzu | Joy | Kirish holati | Chiqish holati |
|---|---|---|---|---|
| 7 | Qo'shish ma'nosi | hovli/bozor | **Zaynab keladi** — guruhga yangi do'st qo'shildi; narsalar ham qo'shilyapti | "Qo'shilsa — ko'payadi" tushunildi (birlashtirish) |
| 8 | Ayirish ma'nosi | hovli/bozor | Narsalardan bir qismi berildi/ketdi — kamaydi | "Olib qo'yilsa — kamayadi" tushunildi |
| 9 | 5 ichida amallar (amaliyot) | mahalla | Do'stlar 5 ichida qo'shib-ayirib mashq qiladi | 5 ichida amallar puxtalandi |
| 10 | 10 ichida amallar | mahalla | Endi 10 gacha narsalar bilan ishlanadi | 10 ichida qo'shish-ayirish mahkamlandi |
| 11 | O'rin almashtirish | mahalla | Narsalarni o'rni almashsa, jami o'zgaradimi? | "3+2 = 2+3" — tartib jamini o'zgartirmaydi |
| 12 | Tenglik/tengsizlik, qavslar | mahalla | Yozuvlar to'g'rimi-noto'g'rimi tekshiriladi; qavs ichi avval | **[KOMP1 OXIRI]** to'g'ri/noto'g'ri ajratildi; mahalla bo'ylab sayohatga tayyorgarlik (§4) |

### ZONA C — Maktab va mahalla, o'nlik (Dars 13–20 · 11–20, o'nlikdan o'tish)

| № | Mavzu | Joy | Kirish holati | Chiqish holati |
|---|---|---|---|---|
| 13 | O'nlik — sanoq birligi | maktab/bog' | **[KOMP2 BOSHI]** §4 chiqishidan davom; **Bekzod** maktab/mahalla bosqichida qo'shiladi; 10 ta narsa bitta dasta bo'ladi | "O'nlik = 10 ta birga" tushunildi |
| 14 | Sonlar 11–15 | maktab/mahalla | Bir o'nlik + bir nechta — 11–15 hosil bo'ladi | 11–15 o'qildi/yozildi (razryad) |
| 15 | Sonlar 16–20 | maktab/mahalla | 16–20 ham xuddi shunday quriladi | 20 gacha sonlar mahkamlandi |
| 16 | 10gacha to'ldirish | maktab | O'nlikni to'ldirish uchun nechta yetishmaydi? | "to'ldiruvchi juft" topildi (8+2, 7+3…) |
| 17 | O'nlikdan o'tib qo'shish | maktab/mahalla | O'tish bilan qo'shish — avval 10 ga to'ldirib | O'tish bosqichlari ochildi |
| 18 | O'tish bilan qo'shish (amaliyot) | mahalla | Endi mustaqil mashq | O'tish bilan qo'shish puxtalandi |
| 19 | O'nlikdan o'tib ayirish | maktab/mahalla | O'tish bilan ayirish — avval 10 dan | Ayirishda o'tish ochildi |
| 20 | O'tish bilan ayirish (amaliyot) | mahalla | Mustaqil mashq + xatoni topish | 20 ichida amallar to'liq mahkamlandi |

### ZONA D — Shahar (Dars 21–23 · 21–100)

| № | Mavzu | Joy | Kirish holati | Chiqish holati |
|---|---|---|---|---|
| 21 | 21–100 hosil bo'lishi | shahar | Mahalladan kattaroq joy — ko'p o'nliklar; "21 = 2 o'nlik + 1" | Ikki xonali sonlar quriladi |
| 22 | Ikki xonali: o'qish/yozish/taqqoslash | shahar | Katta sonlarni o'qish va qaysi katta? | Ikki xonali sonlar o'qildi va taqqoslandi |
| 23 | Sanoq ketma-ketligi (5lab/10lab) | shahar | Shahar bo'ylab katta qadamlar bilan sanash | 5lab/10lab oldinga-orqaga sanash; **[2-yarim yakuni]** |

---

## 4. KOMP CHEGARASI — Dars12 → Dars13 choki (so'zma-so'z qotirilgan)

Bu yagona joy, bunda ikki komp ulanadi. Ikkala tomon AYNAN shu matnga tayanadi.

**Dars12 ning chiqish holati (Komp1 yozadi, sGuest/yakunda):**
> Mahallada sonlar va amallar o'rganilib bo'ldi. Do'stlar (Ra'no, Anvar, Zaynab)
> endi kattaroq sonlar dunyosiga — maktab tomon yo'l oladi. "Bizga endi
> o'ndan katta sonlar kerak bo'ladi" degan ishora bilan tugaydi.

**Dars13 ning kirish holati (Komp2 yozadi, sIntro'da AYNAN shundan boshlanadi):**
> O'tgan safar mahallada amallarni o'rgandik. Bugun do'stlar maktab/bog'ga keldi —
> bu yerda narsalar juda ko'p, ularni bittalab sanash uzoq. **Bekzod** ham shu
> yerda — u 10 tani bitta dasta qilishni ko'rsatadi. Shu tariqa o'nlik tug'iladi.

Ikkala komp ham bu ikki xatboshini O'ZGARTIRMAYDI. Agar biri o'zgartirsa —
ikkinchisiga xabar berilib, shu hujjat yangilanadi, keyin ishlanadi.

---

## 5. TAKRORLANUVCHI ELEMENTLAR (canon davomiyligi uchun)

- **Olmali savat (`BasketArt`)** — Dars01 sovg'asi; keyingi bayram/o'yin-zonalarda
  qaytadi (do'stona belgi).
- **Sahna:** `room` (uy ichi) va `door` (ko'cha) — ETALON §3. Zona C/D da yangi
  fon qo'shilsa, xuddi shu masshtab/uslub qoidasi bilan.
- **Bit ulamasi:** har `sIntro` "O'tgan safar …" bir jumla bilan boshlanadi
  (qayta tanishtirish YO'Q — personajlar allaqachon tanish).
- **Yulduzli ko'ylak** (Ra'no, Dars01 s4) — bayram/yasaнish holatlarida qaytishi mumkin.

---

## 6. YANGILANISH TARTIBI

Bu hujjat o'zgarsa (yangi personaj joyi, chok matni, dars syujeti) — o'zgarish
shu faylga kiritiladi, git orqali ikkala kompga yetkaziladi, KEYIN ishlanadi.
Yaratish paytida hujjat statik. ETALON_1SINF.md kabi, syujet o'zaги o'zgarishi —
alohida, ongli qaror (navbatdagi darsning yon ta'siri sifatida emas).
