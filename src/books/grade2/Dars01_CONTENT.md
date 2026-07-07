# Dars01 «O'nliklar va birliklar» — CONTENT v2 «YULDUZ PORTI» (RU + UZ + audio)

> Pipeline [2] content, **v2 — kosmik qobiq** (metodist 2026-07-07: 1-sinfga o'xshab
> qolgan sinfxona-qobiq rad etildi; yangi syujet = Yulduz porti, faqat Bit).
> Kontrakt: `ETALON_2SINF.md`, `2sinf_metodologiya.md`, `SYUJET_2SINF.md` (Zona A).
> Mexanika/pedagogika v1 bilan BIR XIL (16 ekran, sonlar/variantlar/hint mantiq) —
> faqat dunyo/rekvizit/matn yangi. Audio maydonlar **TTS-toza** (sonlar so'z bilan,
> belgi/«»/ikki-nuqta-ro'yxat yo'q, bir segment = bir fikr; xato-hint metodni
> ko'rsatadi, sonni bermaydi). Register: RU `ты`, UZ `siz`, SOV, oddiy `'`.
> UZ — TOZA LOTIN (kirill homoglif TAQIQ — server til-detektini buzadi).
>
> Dunyo (v3, metodist 2026-07-07): **hammasi KEMA ICHIDA** — koinotdagi yuk kemasining yuk
> bo'limi. **Mikrogravitatsiya:** buyumlar suzadi, sekin aylanadi, inersiya bilan harakat qiladi,
> magnit-qulf ohista tortadi (tortishish-tushish YO'Q). Vizual **realistik**: metall qovurg'ali
> devor, illyuminatorlar (ortida koinot), tutqichlar, boshqaruv panellari. Rekvizit — faqat
> kosmik: **batareya** (birlik), **kasseta** = 10 batareya (o'nlik, yopilganda chiroq yonadi),
> neon-displey, lyuk-kod paneli, yuk xati-planshet, dvigatel/illyuminator. **Barcha savol-buyum
> kosmik** (s1 ham). Cast: **faqat Bit** (diktor + ichki mezbon; ayol ovoz, 3-shaxs).
> Scope: Б1, 100 gacha; barcha sonlar 100 ichida.

---

## s0 — HOOK (scope: hook, scored=false)

**Vizual (lead):**
- RU: «Мы на грузовом корабле в космосе. Контейнер раскрылся — батарейки поплыли в невесомости!»
- UZ: "Biz koinotdagi yuk kemasidamiz. Konteyner ochilib ketdi — batareyalar vaznsizlikda suzib ketdi!"

**Prognoz-savol** (xato tanlovga yashil "to'g'ri" chiqmaydi — correct-key + on_wrong):
- RU: «Как быстро узнать, сколько их?» · UZ: "Ularning sonini tez qanday bilamiz?"
- Variantlar:
  1. RU «Считать по одной» / UZ "Bittalab sanaymiz"
  2. RU «Складывать по десять в кассету» / UZ "O'ntadan kassetaga joylaymiz"  ← **yetakchi (correct-key)**
  3. RU «Не знаю» / UZ "Bilmayman"

**Audio (intro, ketma-ket):**
1. RU: «Добро пожаловать на грузовой корабль! Здесь Бит у себя дома.» / UZ: "Yuk kemasiga xush kelibsiz! Bu yerda Bit o'z uyida."
2. RU: «В грузовом отсеке раскрылся контейнер. Батарейки поплыли в невесомости.» / UZ: "Yuk bo'limida konteyner ochilib ketdi. Batareyalar vaznsizlikda suzib yuribdi."
3. RU: «Их нужно собрать и посчитать. Давай найдём быстрый способ.» / UZ: "Ularni yig'ib sanash kerak. Keling, tez yo'l topamiz."

**on_wrong (1-variant, bittalab):** RU: «Так можно, но это долго. На корабле есть способ быстрее.» / UZ: "Bunday bo'ladi, lekin uzoq. Kemada tezroq yo'l bor."
**on picks 2 (yetakchi):** RU: «Отличная мысль! Соберём по десять — и станет видно.» / UZ: "Zo'r fikr! O'ntadan yig'amiz — va ko'rinadi."
**on picks 3 (bilmayman):** RU: «Ничего. Сейчас увидим способ корабля.» / UZ: "Hechqisi yo'q. Hozir kemaning yo'lini ko'ramiz."

*Jonli animatsiya (mikrogravitatsiya):* konteyner ochiladi, batareyalar vaznsizlikda **suzib**
tarqaladi (sekin aylanib, inersiya bilan; tushish YO'Q). Ambient: illyuminatorda yulduzlar,
suzuvchi chang-zarralar.

---

## s1 — PREREKVIZIT-RECALL (scope: null; grade1 spaced retrieval)

**Vizual (lead):** RU «Вспомним правило.» / UZ "Qoidani eslaymiz."
**Savol:** RU «Если собрать десять единиц вместе — что получится?» / UZ "O'nta birlikni birga to'plasak — nima hosil bo'ladi?"
**Variantlar:** 1) RU «Один десяток» / UZ "Bitta o'nlik"  ← **correct** · 2) RU «Одна единица» / UZ "Bitta birlik" · 3) RU «Сто» / UZ "Yuz"
**correctIdx:** 0

**wrong_1 (birlik):** RU «Единица — это одна батарейка. Десять вместе — это больше.» / UZ "Birlik — bitta batareya. O'nta birga — bu ko'proq."
**wrong_2 (yuz):** RU «Сто — это очень много. Мы собрали только десять.» / UZ "Yuz — juda ko'p. Biz faqat o'ntani to'pladik."
**on_correct:** RU «Верно! Десять единиц вместе — это один десяток.» / UZ "To'g'ri! O'nta birlik birga — bu bitta o'nlik."
**Audio (intro):** RU «На корабле грузы считают десятками. Вспомни правило: десять единиц — это один десяток.» / UZ "Kemada yuklar o'nlab sanaladi. Qoidani eslang: o'nta birlik — bu bitta o'nlik."

*Vizual:* o'nta kichik porlovchi birlik-element vaznsizlikda suzib kelib bitta blokka birlashadi
(tayoqcha EMAS — kosmik element).

---

## s2 — OCHILISH-1 · kassetaga joylash (scope: null) [tasvir 1: kasseta]

**Vizual (lead):** RU «Уложи десять батареек в кассету.» / UZ "O'nta batareyani kassetaga joylang."
**Mexanika:** sochilgan batareyani bittalab kassetaga o't kaz (tap-to-move); 10 ga yetsa —
kasseta yopiladi, chiroq yonadi.
**Audio (qadam-segmentlar):**
1. RU «Перед тобой рассыпанные батарейки. Переноси их по одной в кассету.» / UZ "Oldingizda sochilgan batareyalar. Ularni bittalab kassetaga o'tkazing."
2. RU «Когда батареек станет десять — кассета закроется, и загорится огонёк.» / UZ "Batareyalar o'nta bo'lganda kasseta yopiladi va chiroq yonadi."
3. RU «Одна кассета — это один десяток. Теперь считать удобно.» / UZ "Bitta kasseta — bu bitta o'nlik. Endi sanash qulay."

---

## s3 — OCHILISH-2 · 24 ni yig'ish (scope: null) [tasvir 2: ko'p kasseta + batareya]

**Vizual (lead):** RU «Собери груз: двадцать четыре батарейки.» / UZ "Yukni yig'ing: yigirma to'rtta batareya."
**Mexanika:** 2 kasseta + 4 alohida batareya (tap).
**Audio (qadamlar):**
1. RU «Возьми две кассеты. Это два десятка — двадцать.» / UZ "Ikkita kasseta oling. Bu ikki o'nlik — yigirma."
2. RU «Добавь четыре отдельные батарейки. Это четыре единицы.» / UZ "To'rtta alohida batareya qo'shing. Bu to'rt birlik."
3. RU «Два десятка и четыре единицы — двадцать четыре.» / UZ "Ikki o'nlik va to'rt birlik — yigirma to'rt."

---

## s4 — OCHILISH-3 · yuklash pulti 34 (scope: null) [tasvir 3: pult + bloklar]

**Vizual (lead):** RU «Пульт погрузки. Собери число тридцать четыре.» / UZ "Yuklash pulti. O'ttiz to'rt sonini yig'ing."
**Boshqaruv tugmalari:** RU «кассета +» / «батарейка +» · UZ "kasseta +" / "batareya +"
**Audio (qadamlar):**
1. RU «Нажимай кнопку кассеты, пока не станет три десятка.» / UZ "Uch o'nlik bo'lguncha kasseta tugmasini bosing."
2. RU «Теперь добавь четыре батарейки.» / UZ "Endi to'rtta batareya qo'shing."
3. RU «Три десятка и четыре единицы — тридцать четыре.» / UZ "Uch o'nlik va to'rt birlik — o'ttiz to'rt."

---

## s5 — OCHILISH-4 · neon-displey kartasi (scope: null) [tasvir 4: displey 34 = 30 + 4]

**Vizual (lead):** RU «Число на табло можно разложить.» / UZ "Displeydagi sonni yoyish mumkin."
**Vizual (displey):** `34 = 30 + 4` (bosib ochiladi/yopiladi)
**Audio (qadamlar):**
1. RU «Нажми на число — оно раскроется на две части.» / UZ "Sonni bosing — u ikki qismga ochiladi."
2. RU «Тридцать — это три десятка. Четыре — это четыре единицы.» / UZ "O'ttiz — uch o'nlik. To'rt — to'rt birlik."
3. RU «Вместе они снова дают тридцать четыре.» / UZ "Birga ular yana o'ttiz to'rtni beradi."

---

## s6 — OCHILISH-5 · eshik-kod: 45 va 54 (scope: null) [tasvir 5: kod-panel kontrasti]

**Vizual (lead):** RU «Одни и те же цифры — а коды разные.» / UZ "Bir xil raqamlar — lekin kodlar har xil."
**Vizual:** chap panel: kod `45` (4 kasseta + 5 batareya) → yashil chiroq, lyuk ochiladi;
o'ng panel: kod `54` (5 kasseta + 4 batareya) → boshqa lyuk.
**Audio (qadamlar):**
1. RU «Код сорок пять — это четыре десятка и пять единиц. Люк отсека открылся!» / UZ "Qirq besh kodi — to'rt o'nlik va besh birlik. Bo'lim lyuki ochildi!"
2. RU «Поменяли цифры местами — получился код пятьдесят четыре. Это уже другой люк.» / UZ "Raqamlar o'rni almashdi — ellik to'rt kodi chiqdi. Bu esa boshqa lyuk."
3. RU «Место цифры решает. Слева десятки, справа единицы.» / UZ "Raqamning o'rni hal qiladi. Chapda o'nliklar, o'ngda birliklar."

---

## s7 — QOIDA (scope: null; hookga qaytadi, frame-tip)

**Vizual (qoida):** RU «В двузначном числе левая цифра — десятки, правая — единицы.» / UZ "Ikki xonali sonda chap raqam — o'nliklar, o'ng raqam — birliklar."
**Audio:** RU «Теперь в порту порядок. Собрали по десять — и сразу видно, сколько десятков и сколько единиц.» / UZ "Endi portda tartib. O'ntadan yig'dik — va darrov ko'rinadi, nechta o'nlik va nechta birlik."

---

## s8 — MASHQ-1 · yuklash pulti "45 ni yig'ing" (scope: practice)

**Vizual (savol):** RU «Собери груз: сорок пять.» / UZ "Yukni yig'ing: qirq besh."
**Mexanika:** kasseta/batareya tugmasi bilan yig'ib, Tekshirish. To'g'ri = 4 kasseta + 5 batareya. AnsPop "= 45".
**Audio (intro):** RU «Собери сорок пять из кассет и батареек. Потом нажми проверить.» / UZ "Qirq beshni kasseta va batareyalardan yig'ing. Keyin tekshirishni bosing."
**on_correct:** RU «Верно! Четыре десятка и пять единиц — сорок пять.» / UZ "To'g'ri! To'rt o'nlik va besh birlik — qirq besh."
**on_wrong (metod):** RU «Проверь. Сначала набери десятки, потом единицы.» / UZ "Tekshiring. Avval o'nliklarni, keyin birliklarni yig'ing."

---

## s9 — MASHQ-2 · "nechta o'nlik?" (scope: practice)

**Vizual (savol):** RU «Сколько здесь десятков?» / UZ "Bu yerda nechta o'nlik bor?"
**Vizual:** 5 kasseta + 2 alohida batareya.
**Variantlar:** 5 ← **correct (idx 0)** · 2 · 52 · 7
**wrong (2):** RU «Две — это отдельные батарейки, единицы. Сосчитай кассеты.» / UZ "Ikkita — alohida batareyalar, birliklar. Kassetalarni sanang."
**wrong (52):** RU «Пятьдесят два — это всё число. Десятки — только кассеты.» / UZ "Ellik ikki — butun son. O'nliklar esa faqat kassetalar."
**wrong (7):** RU «Посчитай ещё раз только кассеты.» / UZ "Faqat kassetalarni qaytadan sanang."
**on_correct:** RU «Верно! Пять кассет — пять десятков.» / UZ "To'g'ri! Beshta kasseta — besh o'nlik."
**Audio (intro):** RU «Посмотри на кассеты. Кассета — это десяток.» / UZ "Kassetalarga qarang. Kasseta — bu o'nlik."

---

## s10 — MASHQ-3 · Ha/Yo'q almashtirish-tuzog'i (scope: practice)

**Vizual (savol):** RU «На борту написан код шестьдесят три. Верно ли: это три десятка и шесть единиц?» / UZ "Bortda oltmish uch kodi yozilgan. To'g'rimi: bu uch o'nlik va olti birlik?"
**Variantlar:** RU «Да» / UZ "Ha"  ·  RU «Нет» / UZ "Yo'q"  ← **correct**
**on_wrong (Ha tanlasa):** RU «Посмотри на место цифр. Слева стоит шесть — это десятки.» / UZ "Raqamlar o'rniga qarang. Chapda olti turibdi — bu o'nliklar."
**on_correct:** RU «Верно, это неверная запись. В шестидесяти трёх шесть десятков и три единицы.» / UZ "To'g'ri, bu yozuv noto'g'ri. Oltmish uchda olti o'nlik va uch birlik bor."
**Audio (intro):** RU «Здесь цифры переставили местами. Проверь внимательно.» / UZ "Bu yerda raqamlar o'rni almashtirilgan. Diqqat bilan tekshiring."

---

## s11 — MASHQ-4 · MC + FactCard (scope: practice)

**Vizual (savol):** RU «Какое число — пять десятков и две единицы?» / UZ "Qaysi son — besh o'nlik va ikki birlik?"
**Variantlar:** 52 ← **correct** · 25 · 7 · 502
**wrong (25):** RU «Здесь два десятка и пять единиц. Поменяй местами.» / UZ "Bu yerda ikki o'nlik va besh birlik. O'rnini almashtiring."
**wrong (7):** RU «Семь получится, если сложить. А десятки и единицы стоят отдельно.» / UZ "Yetti — qo'shsak chiqadi. O'nlik va birlik alohida turadi."
**wrong (502):** RU «Это слишком большое число. У нас только десятки и единицы.» / UZ "Bu juda katta son. Bizda faqat o'nlik va birlik."
**on_correct:** RU «Верно! Пять десятков и две единицы — пятьдесят два.» / UZ "To'g'ri! Besh o'nlik va ikki birlik — ellik ikki."

**FactCard (ko'k, to'g'ridan keyin) — teskari sanash:**
- Vizual: RU «Знаешь? Перед стартом ракеты ведут обратный отсчёт: десять, девять, восемь… Старт!» / UZ "Bilasizmi? Raketa uchishidan oldin teskari sanaladi: o'n, to'qqiz, sakkiz… Start!"
- fact_audio: RU «Перед стартом ракеты ведут обратный отсчёт. Десять, девять, восемь и в конце старт.» / UZ "Raketa uchishidan oldin teskari sanaladi. O'n, to'qqiz, sakkiz va oxirida start."

---

## s12 — MASALA intro · yuk xati (scope: null, custom)

**Vizual (lead):** RU «Пора уложить груз в отсек. В накладной: шесть кассет и ещё три батарейки отдельно.» / UZ "Yukni bo'limga joylash vaqti keldi. Yuk xatida oltita kasseta va yana uchta alohida batareya bor."
**Audio:** RU «Шесть кассет по десять — это шесть десятков. И три отдельных батарейки — три единицы.» / UZ "Oltita kasseta o'ntadan — bu olti o'nlik. Va uchta alohida batareya — uch birlik."
*Bridge (↳):* RU «Посчитаем, сколько всего.» / UZ "Jami qanchaligini sanaymiz."
*Vizual:* yuk bo'limi racki, suzuvchi 6 kasseta + 3 batareya (magnit tutqichlarda), yuk xati-planshet.

---

## s13 — MASALA scored MC (scope: practice)

**Vizual (savol):** RU «Сколько всего батареек грузим в ракету?» / UZ "Raketaga jami nechta batareya yuklaymiz?"
**Variantlar:** 63 ← **correct** · 36 · 9 · 60
**wrong (36):** RU «Кассеты — это десятки, их шесть. Поставь десятки слева.» / UZ "Kassetalar — o'nliklar, ular oltita. O'nliklarni chapga qo'ying."
**wrong (9):** RU «Девять — если сложить шесть и три. А в кассетах по десять.» / UZ "To'qqiz — olti va uchni qo'shsak. Kassetalarda esa o'ntadan."
**wrong (60):** RU «Ты забыл три отдельные батарейки.» / UZ "Uchta alohida batareyani unutdingiz."
**on_correct:** RU «Верно! Шесть десятков и три единицы — шестьдесят три.» / UZ "To'g'ri! Olti o'nlik va uch birlik — oltmish uch."
**Audio (intro):** RU «Посчитаем, сколько всего. Кассеты — десятки, отдельные батарейки — единицы.» / UZ "Jami qanchaligini sanaymiz. Kassetalar — o'nliklar, alohida batareyalar — birliklar."

---

## s14 — FINAL test MC (scope: final)

**Vizual (savol):** RU «Какое число на погрузочном табло?» / UZ "Yuklash displeyida qaysi son?"
**Vizual:** 4 kasseta + 7 batareya.
**Variantlar:** 47 ← **correct** · 74 · 11 · 407
**wrong (74):** RU «Считай: кассет четыре — это десятки, слева.» / UZ "Sanang: kasseta to'rtta — o'nliklar, chapda."
**wrong (11):** RU «Одиннадцать — если сложить. А десятки и единицы пишут рядом.» / UZ "O'n bir — qo'shsak. O'nlik va birlik yonma-yon yoziladi."
**wrong (407):** RU «Это слишком большое. Только десятки и единицы.» / UZ "Bu juda katta. Faqat o'nlik va birlik."
**on_correct:** RU «Верно! Четыре десятка и семь единиц — сорок семь.» / UZ "To'g'ri! To'rt o'nlik va yetti birlik — qirq yetti."
**Audio (intro):** RU «Посмотри на кассеты и батарейки. Собери число.» / UZ "Kasseta va batareyalarga qarang. Sonni yig'ing."

---

## s15 — YAKUN (scope: final; can-do + ConnectionsBlock; raketa uchadi)

**Vizual (can-do):** RU «Груз на борту! Теперь ты умеешь видеть в числе десятки и единицы.» / UZ "Yuk bortda! Endi siz sonda o'nlik va birlikni ko'ra olasiz."
**Audio:** RU «Миссия выполнена. Десять единиц — один десяток. Левая цифра — десятки, правая — единицы. В следующий раз научимся читать и записывать бортовые числа.» / UZ "Missiya bajarildi. O'nta birlik — bitta o'nlik. Chap raqam — o'nliklar, o'ng — birliklar. Keyingi safar bort sonlarini o'qish va yozishni o'rganamiz."
*Bayram (kema ichidan):* dvigatel ishga tushadi (yengil tebranish), **katta illyuminatordan yulduzlar
chiziq bo'lib oqadi**, sayyora uzoqlashadi + Bit xursand + Confetti. (Tashqi raketa-uchish EMAS.)

**ConnectionsBlock (conn_refs):**
- Orqaga: 1-sinf — sanash, o'nlikni bog'lash (10 ta birlik = 1 o'nlik).
- Oldinga: Dars02 — bort kodlarini (ikki xonali sonlarni) o'qish va yozish.

---

*Keyingi bosqich [3]: jsx-retheme — sahna (kosmoport), vizualizatorlar (batareya/kasseta/
pult/displey/kod-panel/raketa), CONTENT stringlari. Infra/mexanika o'zgarmaydi.
UZ terminlar draft — o'zbek metodist validatsiyasi.*

---
---

# v4 — BOYITISH: yangi savol tiplari (metodist 2026-07-07)

> Dars "bir xil" (asosan MC) bo'lib qolgani uchun 4 ta yangi tip qo'shiladi (tasniflash,
> ketma-ket diagnostika paneli, taqqoslash, xatoni-top). Barchasi kosmik, tap-first,
> веди-до-верного, xato-hint metodni ko'rsatadi (sonni bermaydi), audio TTS-toza.
>
> **YANGI EKRAN TARTIBI (18 ekran):** s0 hook · s1 recall · s2 pack-ten · s3 build-24 ·
> s4 tap-build-34 · s5 razryad-card · s6 45v54 · s7 rule · s8 build+check-45 (practice) ·
> **sSORT tasniflash (practice)** · **sDIAG diagnostika 4-sub (practice)** · s11 MC-52+fact
> (practice) · **sCMP taqqoslash (practice)** · **sERR xatoni-top (practice)** · s12 case-intro ·
> s13 case-MC-63 (practice) · s14 final-MC-47 (final) · s15 summary.
> (Eski s9 count-tens MC va s10 Ha/Yo'q OLIB TASHLANADI — reversal-tuzoq sDIAG ичiga sub-savol
> bo'lib kiradi. Javob pozitsiyalari yangi ekranlar bo'ylab A/B/C/D ga tarqatilsin.)

## sSORT — TASNIFLASH: yuk tryumiga ajratish (scope: practice)

**Vizual:** suzuvchi aralash yuk — bir nechta kasseta + bir nechta alohida batareya. Ikki tryum:
**«O'NLIKLAR»** (kasseta belgisi) va **«BIRLIKLAR»** (batareya belgisi). Mexanika: elementни bosib,
tryumга yuborish (tap-to-bin yoki drag). Noto'g'ri tryum → element qaytadi + hint. Barcha to'g'ri
joylanganda — solved.
**Vizual (savol):** RU «Разложи груз: кассеты — в отсек десятков, батарейки — в отсек единиц.» / UZ "Yukni ajrating: kassetalar — o'nliklar tryumiga, batareyalar — birliklar tryumiga."
**Audio (intro):** RU «Бортовой сортировщик. Кассеты в одну сторону, отдельные батарейки в другую.» / UZ "Bort saralagichi. Kassetalar bir tomonga, alohida batareyalar boshqa tomonga."
**on_wrong (metod):** RU «Кассета — это десять батареек, значит десяток. Одна батарейка — единица.» / UZ "Kasseta — o'nta batareya, demak o'nlik. Yolg'iz batareya — birlik."
**on_correct:** RU «Верно! Кассеты — десятки, батарейки — единицы.» / UZ "To'g'ri! Kassetalar — o'nliklar, batareyalar — birliklar."

## sDIAG — DIAGNOSTIKA PANELI: 4 ketma-ket sub-savol (scope: practice)

**Vizual:** bort diagnostika paneli; ko'rsatilgan yuk = 3 kasseta + 4 batareya (son 34). 4 sub-savol
KETMA-KET ochiladi; har to'g'ri javob yashil «✓ Savol N» qatoriga yig'iladi va keyingisi ochiladi
(SeqMC, Dars28 naqshi). Har sub-savol veдi-до-верного; jami to'g'ri → panel yashil, solved.
**Audio (intro):** RU «Бортовая диагностика. Ответь на четыре вопроса — панель загорится зелёным.» / UZ "Bort diagnostikasi. To'rt savolga javob bering — panel yashil yonadi."

- **Sub-1:** RU «Сколько десятков?» / UZ "Nechta o'nlik?" — variantlar 3 / 4 / 34 · **to'g'ri 3**
  - no (metod): RU «Считай кассеты — это десятки.» / UZ "Kassetalarni sanang — ular o'nliklar."
- **Sub-2:** RU «Сколько единиц?» / UZ "Nechta birlik?" — variantlar 4 / 3 / 7 · **to'g'ri 4**
  - no: RU «Считай отдельные батарейки.» / UZ "Alohida batareyalarni sanang."
- **Sub-3:** RU «В числе тридцать четыре какая цифра — десятки?» / UZ "O'ttiz to'rt sonida qaysi raqam — o'nliklar?" — variantlar 3 / 4 · **to'g'ri 3**
  - no: RU «Десятки стоят слева.» / UZ "O'nliklar chapda turadi."
- **Sub-4:** RU «Какое это число?» / UZ "Bu qaysi son?" — variantlar 34 / 43 / 7 · **to'g'ri 34**
  - no (reversal-tuzoq): RU «Слева десятки, справа единицы. Не переставляй.» / UZ "Chapda o'nliklar, o'ngda birliklar. O'rnini almashtirmang."
- **done_text (panel yashil):** RU «Диагностика пройдена! Три десятка и четыре единицы — тридцать четыре.» / UZ "Diagnostika o'tdi! Uch o'nlik va to'rt birlik — o'ttiz to'rt."

## sCMP — TAQQOSLASH: qaysi kemada yuk ko'p? (scope: practice)

**Vizual:** ikki kema yonma-yon, bort-kodlari `45` va `54` (har birida kasseta+batareya ko'rinadi).
Bola ko'p yukли kemani bosadi.
**Vizual (savol):** RU «У какого корабля груза больше?» / UZ "Qaysi kemada yuk ko'p?"
**Variantlar:** RU «Корабль сорок пять» / UZ "Qirq besh kemasi" (45)  ·  RU «Корабль пятьдесят четыре» / UZ "Ellik to'rt kemasi" (54) ← **correct**
**Audio (intro):** RU «Два корабля встретились. У кого груза больше? Сначала сравни десятки.» / UZ "Ikki kema uchrashdi. Qaysida yuk ko'p? Avval o'nliklarni solishtiring."
**on_wrong (metod):** RU «Сначала сравни десятки: у кого кассет больше, у того груза больше.» / UZ "Avval o'nliklarni solishtiring: kimda kasseta ko'p, o'shanda yuk ko'p."
**on_correct:** RU «Верно! Пять десятков больше четырёх десятков.» / UZ "To'g'ri! Besh o'nlik to'rt o'nlikdan katta."

## sERR — XATONI TOP: nosoz ko'rsatkich (scope: practice)

**Vizual:** boshqaruv panelida 4 ta ko'rsatkich-yozuvi; 3 tasi to'g'ri, 1 tasi nosoz (o'rin
almashtirilgan). Bola nosoz (xato) ko'rsatkични bosadi. To'g'ri javob = xato yozuv.
**Vizual (savol):** RU «Один сенсор неисправен — записал число неверно. Какой показатель ошибочный?» / UZ "Bir sensor nosoz — sonni noto'g'ri yozgan. Qaysi ko'rsatkich xato?"
**Ko'rsatkichlar (variantlar):**
- A: `24 = 2 o'nlik 4 birlik` — to'g'ri
- B: `36 = 3 o'nlik 6 birlik` — to'g'ri
- C: `52 = 2 o'nlik 5 birlik` — **NOSOZ (to'g'ri javob)** (aslida 5 o'nlik 2 birlik)
- D: `40 = 4 o'nlik 0 birlik` — to'g'ri
**Audio (intro):** RU «Проверь показатели. Три верных, один с ошибкой. Найди неисправный.» / UZ "Ko'rsatkichlarni tekshiring. Uch to'g'ri, bittasi xato. Nosozini toping."
**on_wrong (to'g'ri ko'rsatkichни bosса, metod):** RU «Этот показатель верный: цифры на месте. Проверь другой.» / UZ "Bu ko'rsatkich to'g'ri: raqamlar joyida. Boshqasini tekshiring."
**on_correct:** RU «Верно! Здесь десятки и единицы переставлены — сенсор неисправен.» / UZ "To'g'ri! Bu yerda o'nlik va birlik o'rni almashtirilgan — sensor nosoz."

## s0 ANIMATSIYA TUZATISH (metodist: 1-slayd animatsiyasini tekshir/takomillashtir)

Muammo: batareyalar bir joyда paydo bo'lib faqat kattalashadi (turli yo'nalishга suzib
tarqalmaydi); `d2float` keyframe har batareyaning individual burchagini (`--r`) yo'qotadi.
Tuzatish: har batareya markazdan **turli yo'nalishga** haqiqiy suzib chiqadi (individual
`--dx/--dy` traektoriya + `--r` burchak butun davomida saqlanadi), ohista drift + aylanadi;
konteyner ochilishi va batareyalarning inersiya bilan tarqalishi ishonarli ko'rinadi.
Yetakchi javobda ular kassetaga suzib kelib magnit bilan qulflanadi. Reduced-motion — statik.

---
---

# v5 — IXCHAMLASH: 18 → 15 slayd (metodist 2026-07-07)

> "18 ko'p — ma'lumotni yo'qotmasdan 15 gacha tushir; kerak bo'lsa 1 slaydда 2-3 savol,
> har biri o'z animatsiyasi bilan." Qisqartirish FAQAT test tomonida — tushuntirish
> slaydlari (s2-s6, 5 ta chuqur ochilish) TEGILMAYDI. Mobil/desktop moslashuv saqlanadi.

**YANGI TARTIB (15 ekran):**
1 s0 hook · 2 s1 recall · 3 s2 pack-ten · 4 s3 build-24 · 5 s4 build-34 · 6 s5 card-30+4 ·
7 s6 45v54 · 8 s7 rule · 9 s8 build+check-45 · 10 sSORT tasniflash · 11 sDIAG (4 sub-savol) ·
**12 sPANEL «Bort testi» (3 sub-savol)** · **13 sCASE «Yuk xati» (kirish+savol birlashgan)** ·
14 s14 final-47 · 15 s15 summary.

## sPANEL — «BORT TESTI»: 3 ketma-ket savol, har biri o'z figurasi/animatsiyasi (scope: practice)

sDIAG kabi ketma-ket ochiladi (✓-yig'iladi), lekin har sub-savol BOSHQA mexanika/figura va
o'z animatsiyasi bilan. Har sub веди-до-верного; hammasi to'g'ri → panel yashil, solved.
firstTry = har sub 1-urinishда to'g'ri.
**Audio (intro):** RU «Бортовой тест. Три задания — панель загорится зелёным.» / UZ "Bort testi. Uchta topshiriq — panel yashil yonadi."

- **Sub-1 = eski s11** (MC-52 + FactCard). Savol/variantlar/hintlar/on_correct — s11 dan AYNAN.
  Figura: razryad displey. To'g'ridан keyin **FactCard (raketa teskari-sanash)** chiqadi (fact + fact_audio s11 dan).
- **Sub-2 = eski sCMP** (taqqoslash 45/54). Savol/variantlar/hint/on_correct — sCMP dan AYNAN.
  Figura: ikki kema (CompareShips), g'olib faqat to'g'ridан keyin porlaydi.
- **Sub-3 = eski sERR** (nosoz ko'rsatkich). Savol/4 ko'rsatkich/hint/on_correct — sERR dan AYNAN.
  Figura: 4 ko'rsatkich-qatori, nosozi topilganда yashil.
- **done_text (panel yashil):** RU «Тест пройден! Ты видишь десятки и единицы в любом числе.» / UZ "Test o'tdi! Har sonда o'nlik va birlikni ko'ryapsiz."

> Eski alohida s11, sCMP, sERR ekranlari OLIB TASHLANADI — mazmuni shu panel sub-savollari.
> To'g'ri javob pozitsiyalari sub-savollar bo'ylab almashsin (hammasi bir xil emas).

## sCASE — «YUK XATI»: kirish + savol bitta slaydда (scope: practice)

Eski s12 (kirish) + s13 (savol 63) BITTA ekranда. Yuqorida yuk-xati konteksti (6 kasseta +
3 batareya, suzuvchi rack) va ↳ bridge; pastда MC savol ochiladi (yoki "Hisoblash/Davom"
bosilganда). Kirish audiosi (eski s12) + savol audiosi (eski s13) ketma-ket.
- **Kirish (eski s12):** lead + audio — AYNAN eski s12 dan.
- **Savol (eski s13):** «jami nechta?» 63/36/9/60, hint/on_correct — AYNAN eski s13 dan.
- Bir ekranда: kontekst KO'RINIB turadi (bola sonlarni ko'rib javob tanlasin), scored=practice.

> Eski alohida s12/s13 ekranlari BITTA sCASE bo'ladi.

---
---

# v6 — FAKTNI ALOHIDA SLAYDGA (metodist 2026-07-07)

> Muammo: sPANEL (12-slayd) da sub-1 to'g'ridan keyin FactCard javob zonasi ichida qolib,
> keyingi sub-savollar bilan birga **skroll** chiqargan. Yechim: FactCard sPANEL dan OLIB
> TASHLANADI, o'z alohida slaydiga chiqadi (sPANEL — toza 3 savol, skrollsiz).

**YANGI TARTIB (16 ekran):** …11 sDIAG · 12 sPANEL (3 sub, **FactCARDSIZ**) ·
**13 sFACT (FactCard alohida slayd)** · 14 sCASE · 15 s14 final-47 · 16 s15 summary.

## sFACT — «BILASIZMI?» fakt slaydi (scope: null, scored EMAS)

sPANEL dan keyin qisqa mukofot/nafas slaydi — faqat katta animatsion FactCard (raketa
teskari-sanash), o'z-o'zicha yetarli joy (skrollsiz). Bridge bilan ulanadi.
- **Bridge (↳):** RU «Тест пройден. А теперь — факт.» / UZ "Test o'tdi. Endi — bir fakt."
- **FactCard (ko'k):** matn — eski s11 `fact` dan AYNAN: RU «Знаешь? Перед стартом ракеты ведут обратный отсчёт: десять, девять, восемь… Старт!» / UZ "Bilasizmi? Raketa uchishidan oldin teskari sanaladi: o'n, to'qqiz, sakkiz… Start!"
- **fact_audio:** eski s11 `fact_audio` dan AYNAN (RU/UZ, TTS-toza).
- **Vizual:** raketa teskari-sanash animatsiyasi (10-9-8 puls), ambient. "Davom" bilan o'tiladi.

> sPANEL sub-1 endi FactCardsiz: 52-savol to'g'ridan keyin qisqa AnsPop reveal → ✓-yig'iladi,
> darrov sub-2 ochiladi (fakt kutmaydi). Boshqa hammasi o'zgarmaydi.

---
---

# v7 — FAKT: ALOHIDA SLAYD BEKOR, FINAL SLAYDGA (metodist 2026-07-07)

> "Faktni alohida slaydga qo'yma." v6 dagi sFACT slaydi BEKOR qilinadi. Fakt endi
> **final test slaydiga (s14)** to'g'ri javobdan keyin chiqadi (factOnCorrect — standart
> etalon naqsh, bitta savolli slaydда joy bor, skrollsiz). Dars yana 15 ekran.

**YANGI TARTIB (15 ekran):** …10 sDIAG · 11 sPANEL (3 sub, faktsiz) · 12 sCASE ·
**13 s14 final-47 + FactCard (factOnCorrect)** · 14 s15 summary.
(sFACT olib tashlanadi; TOTAL_SCREENS=15.)

- **s14 fact:** eski s11 `fact`/`fact_audio` AYNAN — raketa teskari-sanash, to'g'ri javobdan
  keyin ko'k FactCard, ovozli. Skrollsiz bo'lishi 390px da tekshirilsin (agar final figura +
  fakt sig'masa — build+check s8 tugashiga qo'yilsin, lekin avval s14 sinalsin).

---
---

# v8 — MISSIYA-ZANJIRI + MA'NOLI O'TISHLAR (metodist 2026-07-07)

> Vizyon: butun dars = BITTA global maqsad (Bit kemani uchirishi kerak — biz yordam
> beramiz), u kichik lokal qadamlar zanjiri orqali yechiladi: TUSHUNAMIZ → O'RGANAMIZ →
> BAJARAMIZ → UCHAMIZ. Har slayd — missiyaga ma'noli qadam; slaydlar bir-biriga ma'noli
> o'tadi (↳ ko'prik: ekranда + audio-intro boshiga qo'shiladi). Mexanika/sonlar o'zgarmaydi —
> faqat FRAMING, KO'PRIKLAR va TAYYORLIK-SHKALASI qo'shiladi.
>
> **Missiya sababi (matematika = uchish kaliti):** kema dvigateli batareyalarni FAQAT
> kassetada (o'ntadan) qabul qiladi — sochilgan yakka batareya yoqilg'i bo'lolmaydi.
> Shuning uchun o'nlik/birlikni o'rganmasдan uchib bo'lmaydi.

## s0 — MISSIYA (qayta-framing)
**Vizual (lead):** RU «Бит готовит корабль к старту. Но двигатель принимает батарейки только кассетами — по десять. А они рассыпались по отсеку!» / UZ "Bit kemani uchishga tayyorlayapti. Lekin dvigatel batareyalarni faqat kassetada — o'ntadan qabul qiladi. Ular esa bo'lim bo'ylab sochilib ketgan!"
**Global savol:** RU «Помоги Биту: как быстро подготовить груз, чтобы взлететь?» / UZ "Bitga yordam bering: uchish uchun yukni qanday tez tayyorlaymiz?"
(Variantlar/on_wrong/correct-key o'zgarmaydi: bittalab / o'ntadan kassetaga (yetakchi) / bilmayman.)
**Audio 1:** RU «Бит готовит корабль к старту. Двигатель берёт батарейки только десятками.» / UZ "Bit kemani uchishga tayyorlayapti. Dvigatel batareyalarni faqat o'ntadan oladi."
**Audio 2:** RU «Но они рассыпались по отсеку. Поможем Биту собрать их по десять.» / UZ "Lekin ular bo'lim bo'ylab sochilib ketgan. Bitga o'ntadan yig'ishga yordam beramiz."
**Audio 3:** RU «Соберём груз — и корабль взлетит.» / UZ "Yukni yig'amiz — va kema uchadi."

## Har slaydga ↳ KO'PRIK (ekran + audio-intro boshiga; qisqa, TTS-toza)
| Slayd | UZ ko'prik | RU ko'prik |
|---|---|---|
| s1 | Uchishdan avval eski qoidani eslaymiz. | Перед стартом вспомним правило. |
| s2 | Yoqilg'ini tayyorlaymiz — avval o'nlik nima, ko'ramiz. | Готовим топливо — сначала посмотрим, что такое десяток. |
| s3 | O'nlikni bildik — endi undan sonlarni yig'amiz. | Десяток понятен — теперь соберём из них числа. |
| s4 | Endi pultda o'zimiz yig'amiz. | Теперь соберём сами на пульте. |
| s5 | Yig'dik — endi sonning ichiga qaraymiz. | Собрали — теперь заглянем внутрь числа. |
| s6 | Diqqat: raqamning o'rni muhim. | Внимание: место цифры решает. |
| s7 | Buni qoida qilib olamiz. | Запишем это правилом. |
| s8 | Qoidani bilamiz — endi yukni o'zingiz tayyorlang. | Правило знаем — теперь готовь груз сам. |
| sSORT | Yukni tryumlarga ajratamiz. | Разложим груз по отсекам. |
| sDIAG | Yuk to'g'rimi — diagnostika qilamiz. | Проверим груз — диагностика. |
| sPANEL | Bort testi — deyarli tayyor. | Бортовой тест — почти готово. |
| sCASE | Oxirgi yuk — xatda nechta? | Последний груз — сколько по накладной? |
| s14 | Uchish kompyuteri yakuniy tekshiradi. | Стартовый компьютер сделает финальную проверку. |
| s15 | Yuk tayyor — uchamiz! | Груз готов — взлетаем! |

## s15 — UCHISH (payoff qayta-framing)
**Audio (qo'shimcha, mavjud xulosadan oldin):** RU «Груз собран десятками — двигатель заправлен. Бит взлетает! Ты помог.» / UZ "Yuk o'nliklarga yig'ildi — dvigatel to'ldi. Bit uchmoqda! Siz yordam berdingiz."
(Keyin mavjud can-do + ConnectionsBlock; warp-animatsiya o'zgarmaydi.)

## «UCHISHGA TAYYORLIK» shkalasi (dars-ichi element, INFRA TEGILMAYDI)
Kontent zonasining bir chekkasida ixcham thematik indikator (masalan vertikal yoqilg'i-shkala
yoki ko'tarilayotgan mini-raketa) — `screen / (TOTAL_SCREENS-1)` nisbatiga qarab to'ladi;
oxirgi slaydda to'la. Yozuv: RU «Готовность» / UZ "Tayyorlik" (yoki mono belgi). Skrollsiz
(absolyut joylashuv, kichik), reduced-motion — statik to'ldirish. Stage progress-baridан
FARQLI: bu thematik missiya-ko'rsatkichi. Deterministik (screen indeksiga bog'liq, storedAnswer
tiklanishini buzmaydi).

---
---

# v9 — MATN DIETA: ekranda minimal, ovozda to'liq (metodist 2026-07-07)

> "Tekst ko'p slaydlarda — bolalar uchun qiyin." 7-8 yosh: ovoz — asosiy kanal
> (2sinf_metodologiya §1), ekran matni = qisqa tayanch. AUDIO O'ZGARMAYDI (to'liq
> tushuntirish ovozda qoladi, v8 ko'prik-segmentlari ham). Faqat KO'RINADIGAN matn
> qisqaradi. Ekranda raqam yozish mumkin (ovozda — so'z bilan).

## 1. ↳ ko'prik EKRANDAN OLINADI (hamma slaydda)
Bridge komponenti ko'rinmas bo'ladi — ko'prik faqat OVOZDA (v8 dagi yetakchi audio-segment
saqlanadi). Ekranda ko'prik qatori YO'Q.

## 2. Lead/savol/variantlar — yangi QISQA ko'rinadigan matnlar
(faqat vizual; audio-maydonlar eskicha qoladi)

| Ekran | Eski vizual | YANGI vizual (RU / UZ) |
|---|---|---|
| s0 lead | 2 gap | «Бит не может взлететь!» / "Bit ucha olmayapti!" |
| s0 savol | uzun | «Как быстро подготовить груз?» / "Yukni qanday tez tayyorlaymiz?" |
| s0 variantlar | gaplar | «По одной» / "Bittalab" · «По десять в кассету» / "O'ntadan kassetaga" · «Не знаю» / "Bilmayman" |
| s1 savol | uzun | «Десять единиц вместе — что это?» / "O'nta birlik birga — nima bo'ladi?" |
| s2 lead | uzun | «Уложи батарейки в кассету.» / "Batareyalarni kassetaga joylang." |
| s3 lead | uzun | «Собери 24.» / "24 ni yig'ing." |
| s4 lead | uzun | «Собери 34.» / "34 ni yig'ing." |
| s5 lead | uzun | «Нажми на число.» / "Sonni bosing." |
| s6 lead | — | qoladi (bir qator, yakor): «Одни и те же цифры — а коды разные.» / "Bir xil raqamlar — lekin kodlar har xil." |
| s7 qoida | — | QOLADI aynan (asosiy yakor, bir qator) |
| s8 savol | uzun | «Собери 45.» / "45 ni yig'ing." |
| sSORT lead | juda uzun | «Разложи груз по отсекам.» / "Yukni tryumlarga ajrating." (tryumlar yorliqli) |
| sDIAG intro-qator | uzun | faqat chip «Диагностика» / "Diagnostika" (sub-savollar qisqa, qoladi) |
| sPANEL intro-qator | uzun | faqat chip «Бортовой тест» / "Bort testi" |
| sPANEL sub-2 variantlar | «Корабль сорок пять»… | faqat «45» / «54» (kemalar kodni ko'rsatadi) |
| sPANEL sub-3 savol | 2 gap | «Какой показатель ошибочный?» / "Qaysi ko'rsatkich xato?" |
| sCASE kontekst | uzun gap | «Накладная: 6 кассет и 3 батарейки.» / "Yuk xati: 6 kasseta va 3 batareya." |
| sCASE savol | uzun | «Сколько всего?» / "Jami nechta?" |
| s14 savol | uzun | «Какое число на табло?» / "Displeyda qaysi son?" |
| s15 can-do | 2 gap | «Миссия выполнена!» / "Missiya bajarildi!" + mavjud can-do qatori qoladi |

## 3. O'zgarmaydi
Barcha audio (intro/qadam/ko'prik/hint/on_correct/fakt) — to'liq, eskicha. Hint/feedback
vizuallari (javobdan keyin bittadan chiqadi — matn-devor emas) — eskicha. Qoida s7,
FactCard matni — eskicha. Mexanika/variant mantiq/pozitsiyalar — eskicha.
