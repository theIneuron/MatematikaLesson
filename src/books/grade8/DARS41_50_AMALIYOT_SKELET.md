# 8-SINF AMALIYOTI, 41-50 DARSLAR — SKELET (1-etap)

Metodist topshirig'i 2026-08-25: **41-50 darslarning har biri 1-darsning o'nta
mexanikasidan foydalanadi, lekin har darsda BOSHQA ketma-ketlikda.** Fon rangi va
dizayn tegilmaydi (`#fff7ed`, urg'u `#fe5b1a`, `kit.jsx` palitrasi). Ha/yo'q
savollarining javoblari faqat «Ha, Yo'q» ketma-ketligida bo'lmaydi — to'rt
kombinatsiya aylanadi.

O'nta mexanika (`practice/kit.jsx`, umumiy qatlam, nusxa YO'Q):

| Kod | Mexanika | Nima qiladi |
|---|---|---|
| A | `Choice` | to'rt fikrdan bittasini tanlash (variantlar SO'Z, uch tilda) |
| B | `Zones` | kartalarni ikki guruhga taqsimlash |
| C | `TrueFalse` | ikki da'voga «Ha» yoki «Yo'q» |
| D | `PairSlots` | oltita kartani uch juftlikka yig'ish |
| E | `TypeValue` | javobni SON bilan yozish |
| F | `MarkAll` | oltitadan uchtasini belgilash («hammasi yoki hech narsa») |
| G | `CodeLock` | uch sonli kod, O'SISH tartibida |
| H | `ClozeBank` | qoidadagi uch bo'shliqni so'z kartalari bilan to'ldirish |
| I | `SwapOrder` | to'rt qadamni to'g'ri tartibga keltirish |
| J | `MatchPairs` | chap ustunni o'ng ustunga juftlash |

Amaliyotda ovoz yo'q. O'nta topshiriq chip bilan tanlanadi (`Dars01Practice.jsx`
naqshi), til platformadan keladi (`lang`), o'z almashtirgichi yo'q.

---

## 0. HAMMA TASDIQ NAZARIY DARSDAN OLINGAN

Har topshiriqning matematikasi `Dars41.jsx` … `Dars50.jsx` ning `STATEMENTS` va
`MISS` ro'yxatlaridan chiqadi, ular esa darslikdan. Amaliyot yangi fakt ham,
yangi atama ham kiritmaydi.

| Dars | Mavzu | Tasdiqlar (T) | Adashishlar (З) |
|---:|---|---|---|
| 41 | Uchburchakning yuzi | `S = ½a·h`; to'g'ri burchaklida yuza ikki katetning yarim ko'paytmasi; asosi va balandligi teng uchburchaklar tengdosh | З85 ikkiga bo'lish unutildi, З86 gipotenuza asos yoki balandlik deb olindi, З16 |
| 42 | Trapetsiyaning yuzi | `S = (a+b)/2 · h`; `S = m·h` (o'rta chiziq bilan); balandlik yon tomon EMAS | З87 asoslar ko'paytirildi, З88 balandlik yon tomon bilan chalkashdi, З16 |
| 43 | Falyes teoremasi, o'rta chiziq | Falyes teoremasi; uchburchakning o'rta chizig'i uchinchi tomonga parallel va uning yarmi; trapetsiyaning o'rta chizig'i asoslar yig'indisining yarmi | З89 parallellik tekshirilmadi, З90 o'rta chiziq to'liq tomonga teng deb olindi, З16 |
| 44 | Pifagor teoremasi va isboti | gipotenuza to'g'ri burchakka qarama-qarshi va ENG KATTA tomon; `c² = a² + b²`; isbot — to'rt uchburchak bitta kvadrat ichida ikki xil joylashtiriladi | З91 `c = a + b`, З92 `b = c − a`, З93 gipotenuza noto'g'ri tanlandi, З16 |
| 45 | Teskari teorema | katet gipotenuzadan kichik; tenglik bajarilsa uchburchak to'g'ri burchakli va to'g'ri burchak ENG KATTA tomonga qarama-qarshi; gipotenuza va bir katetga ko'ra tenglik | З94 eng katta tomon aniqlanmadi, З95 to'g'ri burchak boshqa uchga qo'yildi, З96 tenglik mezoni chalkashdi, З16 |
| 46 | Balandlik tomonlarga ko'ra, Geron formulasi | `p = (a+b+c) : 2`; katta tomonga KICHIK balandlik mos keladi; `S = √(p(p−a)(p−b)(p−c))`, uchala tomon ma'lum bo'lganda | З97 `p` perimetrning o'zi deb olindi, З98 katta tomonga katta balandlik, З16 |
| 47 | Pifagor bilan masalalar | 3, 4, 5 uchligi TEKSHIRISH vositasi; noma'lum harf bilan belgilanadi va tenglama yechiladi; teng tomonlida balandlik asosning YARMIGA qo'llashdan topiladi | З99 farq noto'g'ri tomonga yozildi, З100 to'liq asos ishlatildi, З101 ip teng bo'laklarga bo'lindi, З16 |
| 48 | Aylana, markaziy burchak | markazdan o'tuvchi vatar — diametr; yoy 180° dan kichik yoki teng bo'lsa markaziy burchakka teng, katta bo'lsa 360° dan ayiriladi; ikki yoy yig'indisi 360° | З102 ixtiyoriy vatar diametr deb olindi, З103 katta yoy markaziy burchakka teng deb olindi, З16 |
| 49 | Vatar va diametrning xossalari | vatarga PERPENDIKULYAR diametr uni va yoyni teng ikkiga bo'ladi; vatar diametrdan katta bo'lmaydi; `R² = d² + (vatar : 2)²` | З104 vatarning to'liq uzunligi ishlatildi, З105 istalgan diametr teng ikkiga bo'ladi deb olindi, З16 |
| 50 | To'g'ri chiziq va aylana, urinma | `d > R` da umumiy nuqta yo'q, `d = R` da urinma, `d < R` da ikki nuqta va `AB = 2√(R² − d²)`; urinma radiusga perpendikulyar; tashqi nuqtadan ikki urinma teng | З106 birliklar bir xilga keltirilmadi, З107 `d = R` kesuvchi deb olindi, З16 |

**Blok chegarasi o'ntalikning ichidan o'tadi.** 41-43 — Б6 ning oxiri (yuza va o'rta
chiziq), 44-47 — Pifagor, 48-50 — aylana. Bu §0a.3 dagi guruhlarni belgilaydi.

---

## 0a. BESH QAROR — TO'RTTASI SHU YERDA, BITTASI METODISTNIKI

### 0a.1. HA/YO'Q JAVOBLARI — TO'RT KOMBINATSIYA

Metodist topshirig'i bu o'ntalikda ham kuchda (31-40 skeleti §0a.3):

| Dars | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| javob | Yo'q·Ha | Ha·Ha | Yo'q·Yo'q | Ha·Yo'q | Ha·Ha | Yo'q·Yo'q | Yo'q·Ha | Ha·Ha | Ha·Yo'q | Yo'q·Yo'q |

Uchtadan «Ha·Ha» (42, 45, 48) va «Yo'q·Yo'q» (43, 46, 50), ikkitadan «Yo'q·Ha»
(41, 47) va «Ha·Yo'q» (44, 49). Yonma-yon ikki dars bir xil kombinatsiyada emas, va
41 40-darsning kombinatsiyasini («Ha·Yo'q») takrorlamaydi.

**Ikkala da'vo bir xil javobli bo'lganda yuk razborga o'tadi** — o'quvchi «bittasi
yolg'on bo'lishi kerak» degan kutish bilan keladi. Shuning uchun:

- 43 va 50 — ikkala da'vo ham yolg'on va ular BITTA adashishning ikki tomonini
  ko'rsatadi (43 — З90: «o'rta chiziq tomonga teng» va «tomon o'rta chiziqning
  yarmi»; 50 — З107: `d = R` da «ikki nuqta bor» va «umumiy nuqta yo'q»);
- 46 — ikkala da'vo yolg'on, lekin ular IKKI xil adashish (З97 va З98). Bu
  ataylab: darsning ikki qoq xatosi bir ekranda yonma-yon turadi, razbor har
  birini alohida SON bilan rad etadi (З16);
- 42, 45, 48 — ikkalasi ham rost, va ular bir-biriga juda yaqin turadi, ya'ni
  farqni faqat mazmun beradi.

### 0a.2. AYLANA UCHUN CHIZMA — `fig.jsx` GA `circ` KERAK (METODIST RUXSATI)

48 va 49-darslar aylana haqida, `fig.jsx` esa aylana chizolmaydi: unda `hyp`,
`lin`, `pts`, `axis` va `poly` bor (`poly` 31-40 skeletining §0a.2 si bilan
qo'shilgan edi). Aylanada TOMON yo'q — markaz, radius, vatar, diametr va yoy bor,
ya'ni `poly` bilan ifodalanmaydi.

**Taklif:** `fig.jsx` ga `circ` turi qo'shiladi, ADDITIV (mavjud turlar tegilmaydi):

- aylana va markaz `O`;
- `chords` — vatarlar (uchlari nomi bilan); markazdan o'tgani diametr bo'lib
  ko'rinadi;
- `line` — aylanadan `d` masofada turgan to'g'ri chiziq (urinma, kesuvchi yoki
  tegmaydigan);
- `marks` — perpendikulyarlik kvadratchasi va tenglik shtrixi (`poly` dagidek).

Nega kerak: «bu vatar diametrmi» va «bu diametr vatarni teng ikkiga bo'ladimi»
degan savolni yozuv bilan berish ta'rifni YODLATADI (`O ∈ AB` yozuvini o'qish bir
bosishlik ish), chizma bilan berish esa KO'RSATADI
(`DINAMIKA_VA_ILLUSTRATSIYA.md`). З102 va З105 aynan ko'zning ishi.

**Yo'q desangiz:** 48-06 va 49-01 topshiriqlari yozuv bilan yig'iladi (`O ∈ AB`,
`CD ⊥ AB` ko'rinishidagi kartalar), zaxira variantlari §2 da yozilgan. Lekin
o'shanda bu ikki topshiriq ta'rifni tekshiradi, ko'rishni emas — buni ochiq
aytaman.

### 0a.3. GURUHLAR: UCH UCHLIK VA BITTA YOLG'IZ — 47-DARS YOLG'IZ

O'nta dars uchtaga bo'linmaydi, guruh esa uchtadan katta bo'lolmaydi (1-pozitsiyaga
faqat A, C, F qo'yiladi, ya'ni to'rt darsli guruhda «har mexanika guruh ichida har
xil pozitsiyada» sharti bajarilmay qoladi). 21-30 va 31-40 dagi tuzilma
takrorlanadi, chegaralar MAVZU bo'yicha:

- **41-43** — Б6 ning oxiri: yuza formulalari va o'rta chiziq;
- **44-46** — Pifagor teoremasi, uning teskarisi va Geron formulasi;
- **48-50** — aylana: markaziy burchak, vatar va urinma;
- **47** — yolg'iz: bu MASALA YECHISH darsi, yangi tasdiq kiritmaydi, faqat
  44-46 ni ishga soladi. Uning tartibi qolgan hammasidan kamida **sakkiz
  pozitsiyada** farq qiladi (30 va 40-darslar uchun qabul qilingan kuchaytirilgan
  shart).

**Diqqat, o'lchov:** 47-qator uchun 1-40 dan sakkiz pozitsiya narida turadigan
tartib butun bo'shliqda **BITTA** ekan (181 440 yaroqli tartib to'liq sanab
chiqildi). Ya'ni bu qator tanlanmadi, TOPILDI: `FEACIGJHDB`. Shuning uchun u
birinchi tanlandi, 41-46 va 48-50 esa undan sakkiz pozitsiya uzoqda bo'lish sharti
bilan izlandi.

### 0a.4. KARTA MATNI TARJIMA QILINMAYDI — QOIDA O'SHA

`Zones` ning kartalari (`items[].tokens`), `PairSlots` ning ikki tomoni va
`CodeLock` ning banki `L()` ni QABUL QILMAYDI: ular MATEMATIKA. Shuning uchun
geometriyada karta faqat belgi bilan yoziladi: `a=8,h=3`, `AC=12`, `∠O=75°`,
`R=13, AB=24`, `d=10, 24`, `p=21`.

So'z kerak bo'lganda mexanika `ClozeBank` ga (kartalari `L()` oladi), `Choice` ga
(variantlari `L()` oladi), `MatchPairs` ning CHAP ustuniga (`items[].label` `tr()`
dan o'tadi — `D01_10.jsx` dalili) yoki `MarkAll` ning `label` iga beriladi. Shu
sababli har darsning qoida-topshirig'i `ClozeBank` da, ta'rif-topshirig'i esa
`Choice` da turadi.

**Birlik nomlari (sm, dm, mm) kartaga CHIQMAYDI** — ular uch tilda boshqacha
yoziladi. З106 (birliklar bir xilga keltirilmadi) shuning uchun 50-darsning
`TypeValue` va `MarkAll` topshiriqlarida SETUP matnida turadi, kartada emas.

### 0a.5. ILDIZ VA DARAJA — `frac.jsx` ALLAQACHON BILADI

Pifagor bloki ildizsiz yozilmaydi. `frac.jsx` ning `Row` i `{ r: '85' }` ni ildiz
qilib, `{ b: 'a', e: '2' }` ni daraja qilib chizadi, ya'ni `√85`, `3√3`, `6√2`
yozuvlari uchun umumiy qatlamga tegish KERAK EMAS. Kvadratlar oddiy matnda `²`
belgisi bilan yoziladi (`a² + b² = c²`) — u uch tilda bir xil o'qiladi.

`ClozeBank` ning kartasida ildiz karta matni bo'lib turadi (`'√75'`) — bu uch
tilda bir xil, `D37_05` da `'180°'` xuddi shunday ishlatilgan.

---

## 1. KETMA-KETLIKLAR — O'N DARS

| Dars | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **41** | C | B | F | G | A | H | J | I | D | E |
| **42** | A | E | B | J | G | C | F | D | H | I |
| **43** | F | A | C | H | I | D | E | B | G | J |
| **44** | C | B | A | G | D | H | E | J | I | F |
| **45** | A | F | E | J | I | C | G | D | B | H |
| **46** | F | A | B | D | J | E | I | H | G | C |
| **47** | F | E | A | C | I | G | J | H | D | B |
| **48** | C | E | B | G | J | F | H | I | D | A |
| **49** | F | C | A | H | G | B | E | D | J | I |
| **50** | A | F | C | I | B | H | J | E | G | D |

Kodlar: A `Choice`, B `Zones`, C `TrueFalse`, D `PairSlots`, E `TypeValue`,
F `MarkAll`, G `CodeLock`, H `ClozeBank`, I `SwapOrder`, J `MatchPairs`.

Qiyinlik o'qi hamma darsda o'sha: **🟢🟢🟢 · 🟡🟡🟡🟡 · 🔴🔴🔴** — qiyinlikni MISOL
beradi, mexanika emas.

Tekshirilgan holat:

- guruhlar (41-43, 44-46, 48-50) toza: har mexanika guruh ichida har xil
  pozitsiyada, ya'ni guruhning ikki qatori o'nta pozitsiyaning HAMMASIDA farq
  qiladi;
- hech bir tartib boshqasi bilan ustma-ust tushmaydi;
- 41-46 va 48-50 qolgan hammasidan kamida olti, 47 esa kamida sakkiz pozitsiyada
  farq qiladi;
- birinchi uchtalik 12 darsli deraza ichida takrorlanmaydi;
- 1-pozitsiyada faqat A, C yoki F; 2- va 3-pozitsiyada og'ir tip yo'q.

Tekshiruv: `node scripts/grade8-practice-seq.mjs check` (skelet tasdiqlangandan
keyin `SEQ` ga o'nta qator yoziladi — **jadval haqiqat manbai**, amaliyot fayllari
unga qarab yig'iladi).

---

## 2. CHIZMA: BESH JOYDA, HAMMASI GEOMETRIYADA

| Dars | Topshiriq | Chizma nima qiladi | Tur | Chizmasiz zaxira |
|---:|---|---|---|---|
| 41 | 03 | olti uchburchak: uchtasining asosi va balandligi bir xil, qiyaligi boshqa — tengdoshlik KO'Z bilan ko'rinadi | `poly` | olti yozuv `a` va `h` bilan |
| 42 | 07 | sakkiz trapetsiya, har birida bitta kesma: to'rttasi balandlik (ikkisi ichida, ikkisi TASHQARISIDA), to'rttasi qiya kesma, o'rta chiziq, diagonal va yon tomonga perpendikulyar (З88) | `poly` + `rmark` | sakkiz yozuv, kesmaning ta'rifi matn bilan |
| 43 | 01 | olti uchburchak, har birida bitta kesma: uchtasi o'rta chiziq (ikki uchi ham o'rtada), uchtasi mediana yoki tasodifiy kesma; uch tomonning o'rtasi NUQTA bilan belgilangan | `poly` + `mids` | olti yozuv `M`, `N` va o'rta belgisi bilan |
| 48 | 06 | olti aylana, har birida bitta vatar: uchtasi markazdan o'tadi, ya'ni diametr (З102) | **`circ`** | olti yozuv `O ∈ AB` / `O ∉ AB` bilan |
| 49 | 01 | olti aylana, har birida vatar va uni kesib o'tuvchi diametr: uchtasida diametr vatarga perpendikulyar (З105) | **`circ`** | olti yozuv `CD ⊥ AB` / `CD ⊥̸ AB` bilan |

Chizmada belgi faqat kerak bo'lganda, va belgi TA'RIFNING bo'lagi bo'lsa:
43-01 da tomonning o'rtasi nuqta bilan ko'rsatiladi (aks holda «o'rtami yoki
yo'qmi» degan savol ko'z bilan hal qilinardi — izohi §16a.2), 42-07 da esa
faqat BITTA figurada to'g'ri burchak kvadratchasi turadi: u yon tomonga
tushirilgan perpendikulyarda, ya'ni tuzoqning o'zida (§16a.1). 41-03 da belgi
yo'q — figura faqat SHAKLI bilan hukm qilinadi. 49-01 da perpendikulyarlik
kvadratchasi QO'YILMAYDI: u aynan so'ralayotgan narsa.

44-47 da chizma yo'q va bu ataylab: Pifagor bloki YOZUV va HISOB haqida
(`c² = a² + b²`, uchliklar, Geron formulasi), unda chizma bezak bo'lardi. 44-09
(isbotning to'rt qadami) chizma so'ragandek ko'rinadi, lekin nazariy darsda buni
`SquareSwap` pribori qiladi — amaliyot uni takrorlamaydi, faqat qadamlarning
TARTIBINI tekshiradi.

---
## 3. DARS 41 — UCHBURCHAKNING YUZI

Tasdiqlar `Dars41.jsx` dan: T1 — `S = ½ a · h`; T2 — to'g'ri burchakli uchburchakning
yuzi ikki katetning yarim ko'paytmasiga teng; T3 — asoslari va balandliklari teng
uchburchaklar tengdosh.
Adashishlar: З16, З85 (ikkiga bo'lish unutilgan), З86 (gipotenuza asos yoki
balandlik sifatida olingan).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `area_claims` | `S = a · h` har uchburchakda → **Yo'q**; asosi va balandligi teng ikki uchburchakning yuzi teng → **Ha** | З85. Birinchi da'vo parallelogrammning formulasi, ikkinchisi T3. Razbor birinchisini SON bilan rad etadi: `a = 8`, `h = 3` da yuza 12, 24 emas |
| 02 | B `Zones` | 🟢 | `same_area_groups` | 8 karta ikki guruhga: `S = 24` va `S = 12`. 24: `a=8,h=6`, `a=12,h=4`, `a=16,h=3`, `a=6,h=8`; 12: `a=6,h=4`, `a=4,h=6`, `a=3,h=8`, `a=8,h=3` | З85 aynan shu jadvalda ko'rinadi: ikkiga bo'lmagan o'quvchi 12 lik kartalarni 24 guruhiga qo'yadi, 24 liklariga esa joy topmaydi (48 degan guruh yo'q). Har guruhda `a` va `h` ning qiymatlari almashib turadi, ya'ni faqat bitta songa qarab ajratib bo'lmaydi |
| 03 | F `MarkAll` 🖼 | 🟢 | `equal_area_marked` | Olti uchburchakdan yuzi teng 3 tasini belgilash: uchtasining asosi 8, balandligi 4 (uchi parallel chiziq bo'ylab siljigan, biri o'tmas — balandlik tashqarida), uchtasining asosi yoki balandligi boshqa | T3 ko'z bilan. Rad etilganlar bir qarashda o'xshaydi: bittasining bo'yi baland (`h=6`), bittasining asosi qisqa (`a=5`), bittasi esa keng va past (`a=12, h=2` — yuzasi 12, teng emas) |
| 04 | G `CodeLock` | 🟡 | `code_areas` | Uch uchburchakning yuzi: `a=10, h=6` (30), katetlari 6 va 8, gipotenuzasi 10 (24), `a=14, h=5` (35). Kod o'sish tartibida → **24, 30, 35** | bankda `60` va `70` (З85: `10·6` va `14·5`), `40` (З86: `½·8·10`, gipotenuza balandlik deb olindi). Ikkinchi uchburchakda gipotenuza ATAYLAB berilgan — u hisobga kirmaydi |
| 05 | A `Choice` | 🟡 | `which_formula` | To'rt ifodadan qaysi biri to'g'ri burchakli uchburchakning yuzini beradi: **«ikki katetning yarim ko'paytmasi»** | «gipotenuza bilan katetning yarim ko'paytmasi» (З86), «ikki katetning ko'paytmasi» (З85), «gipotenuza bilan balandlikning ko'paytmasi». Razbor 9-12-15 uchburchagida har variantni son bilan rad etadi (to'g'ri javob 54) |
| 06 | H `ClozeBank` | 🟡 | `rule_words` | qoida: uchburchakning yuzi **asosi** bilan unga mos **balandligi** ko'paytmasining **yarmiga** teng | bankda tuzoq: «perimetri», «yon tomoni» (З86 ning so'z shakli), «ikkilanganiga» (З85 ning teskarisi) |
| 07 | J `MatchPairs` | 🟡 | `base_height_to_area` | To'rt uchburchak ↔ to'rt yuza: `a=8,h=3 ↔ 12`; `a=5,h=6 ↔ 15`; `a=9,h=4 ↔ 18`; katetlari `6` va `7` ↔ `21` | oxirgi juftlikda asos ham balandlik ham AYTILMAGAN, katetlar berilgan (T2). Ikkiga bo'lmagan o'quvchi 24, 30, 36, 42 ni oladi — o'ng ustunda bunday son yo'q, ya'ni З85 darhol ko'rinadi |
| 08 | I `SwapOrder` | 🔴 | `double_steps` | Formulaning chiqishi, to'rt qadam: `BC` diagonali bilan uchburchakni parallelogrammga to'ldiramiz → asos va balandlik o'zgarmaydi (`a, h`) → parallelogrammning yuzi `a·h` → uchburchak uning yarmi `½a·h` | З85 aynan tartibda: `½a·h` ni `a·h` dan OLDIN qo'yish — o'shanda yarim qayerdan kelgani ko'rinmaydi. To'ldirishni oxirga surish ham xato: solishtiradigan figura shundan paydo bo'ladi |
| 09 | D `PairSlots` | 🔴 | `area_back` | Uch juftlik, uchi ham boshqa yo'nalishda: `a=12,h=6 ↔ S=36`; `S=28,a=8 ↔ h=7`; `S=18,h=4 ↔ a=9` | teskari yo'nalishda ikkiga bo'lish emas, IKKILANTIRISH kerak: `h = 2S : a`. З85 bilan yurgan o'quvchi 3,5 va 4,5 ni oladi — butun son chiqmasligi tuzoqni ko'rsatadi |
| 10 | E `TypeValue` | 🔴 | `rect_from_triangle` | Darslikning masalasi (80-bet): to'g'ri to'rtburchak `ABCD`, `AC = 20`, `BP ⊥ AC`, `BP = 12`. To'rtburchakning yuzi = **240** | `120` (faqat bitta uchburchak — diagonal to'rtburchakni IKKI tengdosh uchburchakka bo'ladi), `480` (ikkiga bo'lish unutildi va ikkilantirildi), `60`. Razbor: diagonal — asos, `BP` — unga mos balandlik |

**Qoplov.** T1 — 01, 02, 04, 06, 07, 09, 10. T2 — 04, 05, 07. T3 — 01, 03, 10.
З85 — 01, 02, 04, 06, 07, 08, 09, 10. З86 — 04, 05, 06. З16 — razborlar javobni
har joyda son bilan tekshiradi (qo'yib ko'rish).
**Oldingi darsdan** — 08 da 40-darsning `S = a·h` formulasi asos bo'lib ishlatiladi.

**Harf.** `a` — asos, `h` — balandlik, `S` — yuza (darslikning belgilashi),
uchburchak `ABC`. Takrorlanmaydigan narsa — SONLAR.

---

## 4. DARS 42 — TRAPETSIYANING YUZI

Tasdiqlar `Dars42.jsx` dan: T1 — `S = (a+b)/2 · h`; T2 — `S = m · h`, `m` — o'rta
chiziq; T3 — balandlik yon tomonning o'zi emas, ikki asos orasidagi perpendikulyar
masofa.
Adashishlar: З16, З87 (asoslar yig'indisi o'rniga ko'paytirilgan), З88 (balandlik
yon tomon bilan chalkashtirilgan).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` | 🟢 | `which_formula` | To'rt ifodadan qaysi biri trapetsiyaning yuzini beradi: **«asoslar yig'indisining yarmi balandlikka ko'paytiriladi»** | «asoslar ko'paytmasi balandlikka» (З87), «asoslar yig'indisi balandlikka» (yarim unutildi), «asoslar yig'indisining yarmi YON TOMONGA» (З88). Razbor `a=7, b=5, h=4` da har birini son bilan rad etadi (to'g'ri javob 24) |
| 02 | E `TypeValue` | 🟢 | `area_from_bases` | `a = 7`, `b = 5`, `h = 4` → **24** | `140` (`7·5·4`, З87), `48` (yarim unutildi), `16` (`7+5+4`). Razbor: avval yig'indining yarmi — 6, keyin balandlikka ko'paytirish |
| 03 | B `Zones` | 🟢 | `same_area_groups` | 8 karta ikki guruhga: `S = 24` va `S = 36`. 24: `5,7,4`, `2,6,6`, `1,7,6`, `3,9,4`; 36: `5,7,6`, `8,10,4`, `7,11,4`, `4,8,6` | balandlik ikki guruhda ham 4 va 6, ya'ni faqat `h` ga qarab ajratib bo'lmaydi. `5,7,4` va `5,7,6` yonma-yon turadi: bir xil asoslar, boshqa balandlik — bu ikki guruhga tushadi |
| 04 | J `MatchPairs` | 🟡 | `find_missing` | To'rt trapetsiya, har birida bittasi noma'lum: `S=24, b=7, h=4 ↔ a=5`; `S=30, a=4, h=5 ↔ b=8`; `S=36, a=3, b=9 ↔ h=6`; `S=18, a=2, h=3 ↔ b=10` | TESKARI yo'nalish: `a + b = 2S : h`, keyin ma'lum asosni ayirish. Eng ko'p uchraydigan buzilish — `2S : h` ning o'zini javob deb yozish (uchinchi juftlikda esa `h = 2S : (a+b)`) |
| 05 | G `CodeLock` | 🟡 | `code_areas` | Uch trapetsiya: `a=6, b=10, h=3` (24), o'rta chizig'i 7 va balandligi 4 (28), `a=5, b=9, h=5` (35). Kod o'sish tartibida → **24, 28, 35** | bankda `48` va `70` (yarim unutildi), `56` (o'rta chiziqni asoslar YIG'INDISI deb olib ikkilantirish). Ikkinchi savol T2 bilan yechiladi: o'rta chiziqqa yarim KERAK EMAS, u allaqachon yarim |
| 06 | C `TrueFalse` | 🟡 | `midline_claims` | `S = m · h` har trapetsiyada → **Ha**; `a = 7, b = 5` da `m = 6` → **Ha** | ikkalasi ham rost (§0a.1). O'quvchi bittasini yolg'on deb kutadi va odatda birinchisini rad etadi: «yarim yo'q, demak xato». Razbor ikki formulani bitta misolda yonma-yon hisoblaydi: `(7+5)/2 · 4 = 24` va `6 · 4 = 24` |
| 07 | F `MarkAll` 🖼 | 🟡 | `height_marked` | Sakkiz trapetsiya, har birida bitta kesma chizilgan; balandlik bo'lgan 4 tasini belgilash | З88. Rad etilganlar to'rt xil: qiya kesma, o'rta chiziq (asoslarga parallel), diagonal va yon tomonga perpendikulyar kesma (to'g'ri burchak kvadratchasi bilan). Belgilanadiganlarning IKKITASIDA balandlik figuradan TASHQARIDA tushadi — biri chapga, biri o'ngga qiya trapetsiyada (§16a.1) |
| 08 | D `PairSlots` | 🔴 | `trap_back` | Uch juftlik, uchi ham boshqa yo'nalishda: `a=9,b=5,h=4 ↔ S=28`; `S=40,h=5 ↔ a+b=16`; `m=6,h=7 ↔ S=42` | ikkinchi juftlikda javob bitta asos EMAS, ikkisining yig'indisi: shartda yetarli ma'lumot yo'q va aynan shuni ko'rish kerak. Uchinchisi T2 |
| 09 | H `ClozeBank` | 🔴 | `rule_words` | qoida: trapetsiyaning yuzi asoslari **yig'indisining** **yarmi** bilan **balandligi** ko'paytmasiga teng | bankda tuzoq: «ko'paytmasining» (З87), «yon tomoni» (З88), «ikkilangani» |
| 10 | I `SwapOrder` | 🔴 | `diagonal_steps` | Formulaning chiqishi, to'rt qadam: `AC` diagonalini o'tkazamiz → birinchi uchburchakning yuzi `½a·h` → ikkinchisining yuzi `½b·h` → yuzalarni qo'shamiz `½(a+b)h` | diagonalni oxirga surish — o'shanda qo'shiladigan narsa yo'q. Ikki uchburchakning balandligi BIR XIL ekani (`h`) shu tartibdan ko'rinadi: З88 shu joyda o'ladi |

**Qoplov.** T1 — 01, 02, 03, 04, 08, 09, 10. T2 — 05, 06, 08. T3 — 01, 07, 09, 10.
З87 — 01, 02, 05, 09. З88 — 01, 07, 09, 10. З16 — razborlar javobni son bilan
tekshiradi.
**Oldingi darsdan** — 10 da 41-darsning `½a·h` formulasi ikki marta ishlatiladi.

**Harf.** `a`, `b` — asoslar, `h` — balandlik, `m` — o'rta chiziq, trapetsiya
`ABCD`, diagonal `AC`.

---

## 5. DARS 43 — FALYES TEOREMASI, UCHBURCHAK VA TRAPETSIYANING O'RTA CHIZIG'I

Tasdiqlar `Dars43.jsx` dan: T1 — Falyes teoremasi (parallel chiziqlar bir
kesuvchidan teng kesmalar ajratsa, ikkinchisidan ham teng kesmalar ajratadi);
T2 — uchburchakning o'rta chizig'i uchinchi tomonga parallel va uning yarmiga teng;
T3 — trapetsiyaning o'rta chizig'i asoslariga parallel va ularning yig'indisining
yarmiga teng.
Adashishlar: З16, З89 (parallellik tekshirilmasdan qo'llanildi), З90 (o'rta chiziq
to'liq tomonga teng deb olindi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` 🖼 | 🟢 | `midline_marked` | Olti uchburchak, har birida bitta kesma; o'rta chiziq bo'lgan 3 tasini belgilash. Uch tomonning o'rtasi ham NUQTA bilan ko'rsatilgan (§16a.2) | ta'rifda IKKI shart bor: ikki uchi ham O'RTADA. Rad etilganlar: mediana (bir uchi nuqtada, ikkinchisi uchda), uchga yaqin qiya kesma, uchinchi tomonga parallel, lekin nuqtalardan o'tmagan kesma |
| 02 | A `Choice` | 🟢 | `thales_condition` | Falyes teoremasini qo'llash uchun nima SHART: **«chiziqlar parallel bo'lishi va bir kesuvchidan teng kesmalar ajratishi»** | «kesuvchilarning teng bo'lishi», «ikki kesuvchining parallel bo'lishi», «kesuvchilarning perpendikulyar bo'lishi» — З89. Razbor: parallel bo'lmagan chiziqlar ikkinchi kesuvchida turli kesmalar ajratadi |
| 03 | C `TrueFalse` | 🟢 | `midline_claims` | `MN = AC` → **Yo'q**; `AC = ½ MN` → **Yo'q** | З90 ning IKKI TOMONI (§0a.1). Ikkala da'vo ham yolg'on va bir-biriga teskari: birinchisida yarim umuman yo'q, ikkinchisida u NOTO'G'RI tomonga qo'yilgan. Razbor `AC = 10` da hisoblaydi: `MN = 5`, ya'ni `AC = 2MN` |
| 04 | H `ClozeBank` | 🟡 | `rule_words` | qoida: uchburchakning o'rta chizig'i ikki tomonning **o'rtalarini** tutashtiradi, uchinchi tomonga **parallel** va uning **yarmiga** teng | bankda tuzoq: «uchlarini», «perpendikulyar», «ikkilanganiga» (З90), «teng» |
| 05 | I `SwapOrder` | 🟡 | `split_steps` | Falyes teoremasi bilan kesmani uch teng bo'lakka bo'lish, to'rt qadam: nur o'tkazamiz (`l`) → nurda uchta teng kesma belgilaymiz (`3 × k`) → parallel chiziqlar o'tkazamiz (`∥`) → kesma uch teng bo'lakka bo'linadi (`AB : 3`) | З89: parallel chiziqlarni teng kesmalardan OLDIN qo'yish — o'shanda nimaga parallel o'tkazish kerakligi ma'lum bo'lmaydi. Nurni oxirga surish ham xato: yasash shundan boshlanadi |
| 06 | D `PairSlots` | 🟡 | `midline_back` | Uch juftlik: `AC=14 ↔ MN=7`; `MN=4 ↔ AC=8`; `a=6,b=10 ↔ m=8` | ikkinchi juftlik TESKARI yo'nalishda (ikkilantirish), uchinchisi esa boshqa figurada — trapetsiya (T3). Karta shakli qaysi qoida ekanini aytadi: bitta tomon — uchburchak, ikki asos — trapetsiya |
| 07 | E `TypeValue` | 🟡 | `second_base` | Trapetsiyaning o'rta chizig'i 9, bir asosi 5. Ikkinchi asos = **13** | `4` (`9 − 5`, yarim hisobga olinmadi), `14`, `18`. Razbor: `a + b = 2m = 18`, undan 5 ni ayirish |
| 08 | B `Zones` | 🔴 | `midline_groups` | 8 karta ikki guruhga: o'rta chiziq `m = 6` va `m = 9`. 6: `AC=12`, `a=5,b=7`, `a=1,b=11`, `a=4,b=8`; 9: `AC=18`, `a=6,b=12`, `a=8,b=10`, `a=3,b=15` | ikki QOIDA bitta jadvalda: kartada bitta uzunlik bo'lsa uchburchak (yarim), ikkita bo'lsa trapetsiya (yig'indining yarmi). З90 bilan yurgan o'quvchi `AC=12` ni 12 lik guruhga izlaydi — bunday guruh yo'q |
| 09 | G `CodeLock` | 🔴 | `code_midlines` | Uch savol: uchburchakda `AC = 16` da o'rta chiziq (8), trapetsiyada `a=7, b=13` da o'rta chiziq (10), Falyes bilan 21 uzunlikdagi kesmaning uch teng bo'lagi (7). Kod o'sish tartibida → **7, 8, 10** | bankda `16` va `21` (yozuvdagi sonlar), `20` (`7+13`, yarim unutildi — З90). Uch savol uch xil qoidaga tegadi va ATAYLAB aralash turadi |
| 10 | J `MatchPairs` | 🔴 | `mixed_midlines` | To'rt shart ↔ to'rt natija: «uchburchak, uchinchi tomoni 10» ↔ `MN = 5`; «trapetsiya, asoslari 3 va 9» ↔ `m = 6`; «trapetsiya, o'rta chizig'i 7, bir asosi 4» ↔ `b = 10`; «uchburchak, o'rta chizig'i 6» ↔ `AC = 12` | to'rt juftlikda to'rt xil yo'nalish: to'g'ri va teskari, uchburchak va trapetsiya. Chap ustun SO'Z bilan (`items[].label`, §0a.4), o'ng ustun belgi bilan |

**Qoplov.** T1 — 02, 05, 09. T2 — 01, 03, 04, 06, 08, 09, 10. T3 — 06, 07, 08,
09, 10. З89 — 02, 05. З90 — 03, 04, 07, 08, 09. З16 — razborlar javobni son bilan
tekshiradi.
**Oldingi darsdan** — 06 va 08 da 42-darsning `m` belgisi va o'rta chiziq formulasi.

**Harf.** Uchburchak `ABC`, o'rtalar `M` va `N`, o'rta chiziq `MN`, uchinchi tomon
`AC`; trapetsiyada asoslar `a`, `b` va o'rta chiziq `m` (42-dars bilan bir xil).

---
## 6. DARS 44 — PIFAGOR TEOREMASI VA UNING ISBOTI

Tasdiqlar `Dars44.jsx` dan: T1 — to'g'ri burchakka qarama-qarshi turgan tomon
gipotenuza, u ENG KATTA tomon, qolgan ikkitasi katetlar; T2 — `c² = a² + b²`;
T3 — isbot: bir xil to'rt uchburchak tomoni `(a+b)` bo'lgan kvadrat ichida ikki xil
joylashtiriladi, birinchisida `c²`, ikkinchisida `a²` va `b²` ochiq qoladi.
Adashishlar: З16, З91 (`c = a + b`), З92 (`b = c − a`), З93 (gipotenuza sifatida
noto'g'ri tomon tanlangan).

**Bu darsda TENGLIK tekshiriladi, XULOSA chiqarilmaydi.** «Tenglik bajarildi, demak
uchburchak to'g'ri burchakli» degan yo'nalish teskari teorema, va u 45-dars.
Shuning uchun 02-topshiriqning zonalari `a² + b² = c²` va `a² + b² ≠ c²` deb
yozilgan, «to'g'ri burchakli» va «emas» deb emas.

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `pythagoras_claims` | `c² = a² + b²`, `a=6, b=8, c=10` da → **Ha**; `c = a + b` har to'g'ri burchakli uchburchakda → **Yo'q** | З91. Birinchi da'vo hisob bilan tasdiqlanadi (36 + 64 = 100), ikkinchisi o'sha uchburchakda rad etiladi (6 + 8 = 14, 10 emas). Ikki da'vo BIR uchburchak haqida, ya'ni farq faqat amalda |
| 02 | B `Zones` | 🟢 | `equality_holds` | 8 uchlik ikki guruhga: `a² + b² = c²` va `≠`. Teng: `3,4,5`; `6,8,10`; `5,12,13`; `8,15,17`. Teng emas: `4,5,6`; `5,6,8`; `7,8,10`; `6,7,9` | З91: chiziqli qo'shish bilan yurgan o'quvchi `3+4=7≠5` deb birinchi kartani ham «teng emas» ga qo'yadi. Rad etilganlarning ikkitasi juda yaqin: `7,8,10` da 113 va 100, `6,7,9` da 85 va 81 |
| 03 | A `Choice` | 🟢 | `which_is_hypotenuse` | To'rt fikrdan qaysi biri gipotenuzani to'g'ri ta'riflaydi: **«to'g'ri burchakka qarama-qarshi turgan tomon»** | «eng qisqa tomon», «to'g'ri burchakni tashkil qilgan tomonlardan biri», «har doim `c` harfi bilan belgilangan tomon» — oxirgisi З93, va u 45-darsga ko'prik: harf tomonni tanlamaydi |
| 04 | G `CodeLock` | 🟡 | `code_hypotenuse` | Uch uchburchakning gipotenuzasi: katetlari `3, 4` (5), `6, 8` (10), `5, 12` (13). Kod o'sish tartibida → **5, 10, 13** | bankda `7` (`3+4`) va `14` (`6+8`) — З91 ikki marta, hamda `12` (yozuvdagi son). Kvadratlarni qo'shib, keyin ildizni chiqarish kerak |
| 05 | D `PairSlots` | 🟡 | `sides_back` | Uch juftlik, yo'nalishlari boshqa: `a=9,b=12 ↔ c=15`; `c=25,a=7 ↔ b=24`; `a=20,b=21 ↔ c=29` | ikkinchi juftlikda AYIRISH kerak, lekin kvadratlarning ayirmasi: `625 − 49 = 576`. З92 bilan yurgan o'quvchi `25 − 7 = 18` ni oladi — bunday karta yo'q |
| 06 | H `ClozeBank` | 🟡 | `rule_words` | qoida: to'g'ri burchakka qarama-qarshi tomon **gipotenuza** deyiladi va u **eng katta** tomon; uning kvadrati katetlar **kvadratlarining** yig'indisiga teng | bankda tuzoq: «katet», «eng kichik», «uzunliklarining» — oxirgisi aynan З91, chunki uzunliklarning yig'indisi `a + b` degani |
| 07 | E `TypeValue` | 🟡 | `rhombus_side` | Darslikning masalasi (94-bet): rombning diagonallari 10 va 24, tomonini toping = **13** | `26` (yarim diagonal olinmadi: `10/2` va `24/2` o'rniga butun diagonallar), `17` (`5+12`, З91), `34`. Razbor: diagonallar bir-birini teng ikkiga bo'ladi va perpendikulyar, ya'ni katetlar 5 va 12 |
| 08 | J `MatchPairs` | 🔴 | `mixed_sides` | To'rt shart ↔ to'rt natija: `a=12,b=35 ↔ c=37`; `c=41,a=9 ↔ b=40`; `a=10,b=24 ↔ c=26`; `c=30,a=18 ↔ b=24` | ikki juftlikda gipotenuza izlanadi, ikkitasida katet, va shartlar ARALASH turadi. Oxirgi ikki natija (`c=26` va `b=24`) yaqin: 24 ni gipotenuza deb olib qo'yish З93 |
| 09 | I `SwapOrder` | 🔴 | `proof_steps` | Isbotning to'rt qadami: tomoni `a+b` bo'lgan kvadratni olamiz → to'rt uchburchakni birinchi usulda joylashtiramiz, o'rtada `c²` qoladi → o'sha to'rt uchburchakni boshqa usulda joylashtiramiz, `a²` va `b²` qoladi → katta kvadrat o'zgarmadi, demak `c² = a² + b²` | З78 naqshi: xulosani (`c² = a² + b²`) ikki joylashtirishdan OLDIN qo'yish — o'shanda tenglik hech narsadan chiqadi. Katta kvadratni oxirga surish ham xato: u ikki joylashtirishning UMUMIY o'lchovi |
| 10 | F `MarkAll` | 🔴 | `true_equalities` | Olti tenglikdan rost 3 tasini belgilash: `c² = a² + b²`, `a² = c² − b²`, `b = √(c² − a²)` | rad etilganlar: `c = a + b` (З91), `a = c − b` (З92), `b² = c² + a²` (gipotenuza va katet o'rnini almashtirish, З93). Uchala xato ham bitta tenglikning noto'g'ri qayta yozilishi, ya'ni topshiriq ALGEBRA bilan tekshiriladi |

**Qoplov.** T1 — 03, 06, 08, 10. T2 — 01, 02, 04, 05, 06, 07, 08, 10. T3 — 09.
З91 — 01, 02, 04, 06, 07, 10. З92 — 05, 10. З93 — 03, 08, 10. З16 — razborlar
kvadratlarni son bilan qo'shib tekshiradi.
**Oldingi darsdan** — 07 da rombning diagonallari haqidagi 38-darsning xossasi.

**Harf.** `a`, `b` — katetlar, `c` — gipotenuza (darslikning belgilashi). 03 va 08
da harf ATAYLAB adashtirishga urinadi: `c` yozilgani bilan gipotenuza bo'lib
qolmaydi.

---

## 7. DARS 45 — PIFAGOR TEOREMASIGA TESKARI TEOREMA

Tasdiqlar `Dars45.jsx` dan: T1 — to'g'ri burchakli uchburchakda istalgan katet
gipotenuzadan kichik; T2 — bir tomonning kvadrati qolgan ikkitasining kvadratlari
yig'indisiga teng bo'lsa, uchburchak to'g'ri burchakli, va to'g'ri burchak shu ENG
KATTA tomonga qarama-qarshi uchda turadi; T3 — tekshirishdan oldin eng katta tomon
aniqlanadi; gipotenuzasi va bir kateti teng ikki uchburchak teng.
Adashishlar: З16, З94 (eng katta tomon aniqlanmadi), З95 (to'g'ri burchak boshqa
uchga qo'yildi), З96 (tenglik mezoni chalkashtirildi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` | 🟢 | `how_to_check` | Uchburchak to'g'ri burchakli ekanini qanday tekshiriladi: **«eng katta tomonning kvadratini qolgan ikkitasining kvadratlari yig'indisi bilan solishtirish»** | «oxirida yozilgan tomonning kvadratini solishtirish» (З94), «uchala tomonni qo'shib solishtirish» (З91), «eng kichik tomonning kvadratini solishtirish». Razbor darslikning misolini keltiradi: `√85, 7, 6` da eng katta tomon `√85`, `c` harfi bilan yozilgan 6 emas |
| 02 | F `MarkAll` | 🟢 | `impossible_marked` | Olti yozuvdan MUMKIN BO'LMAGAN 3 tasini belgilash: `c=10, a=12`; `c=8, a=8`; `c=6, a=9` | T1: katet gipotenuzadan KICHIK bo'lishi shart. Qabul qilinadiganlar: `c=13, a=5`; `c=17, a=15`; `c=25, a=24` — oxirgisi chegaraga juda yaqin, lekin hali mumkin. `c=8, a=8` ham mumkin emas: tenglik ham bo'lmaydi |
| 03 | E `TypeValue` | 🟢 | `right_angle_side` | Uchburchakning tomonlari 10, 24, 26. To'g'ri burchak qaysi tomonga qarama-qarshi turadi — o'sha tomonning uzunligini yozing = **26** | `10` (eng kichik), `24` (o'rtadagi — З95), `60` (perimetr). Razbor: `100 + 576 = 676`, ya'ni tenglik ENG KATTA tomon uchun bajariladi, va to'g'ri burchak faqat unga qarshi turadi |
| 04 | J `MatchPairs` | 🟡 | `triple_to_side` | To'rt uchlik ↔ to'g'ri burchakka qarama-qarshi tomon: `9,12,15 ↔ 15`; `7,24,25 ↔ 25`; `4,5,7 ↔` «to'g'ri burchak yo'q»; `6,7,√85 ↔ √85` | uchinchi uchlikda tenglik bajarilmaydi (`16+25=41`, `49`), ya'ni javob YO'Q — bu variant o'ng ustunda so'z bilan turadi. To'rtinchisida eng katta tomon ILDIZ bilan yozilgan va u oxirida turmaydi: З94 aynan shu yerda |
| 05 | I `SwapOrder` | 🟡 | `check_steps` | Tekshirishning to'rt qadami (`5, 11, 12`): eng katta tomonni aniqlaymiz (`12`) → uning kvadratini hisoblaymiz (`144`) → qolgan ikkitasining kvadratlari yig'indisini hisoblaymiz (`146`) → solishtiramiz va xulosa qilamiz (`144 ≠ 146`) | З94: kvadratlarni eng katta tomonni aniqlashdan OLDIN hisoblash — o'shanda nimani nima bilan solishtirish kerakligi ma'lum bo'lmaydi. Solishtirishni oldinga surish ham xato: solishtiradigan ikki son hali yo'q |
| 06 | C `TrueFalse` | 🟡 | `converse_claims` | `6² + 7² = 85` bo'lgani uchun uchburchak to'g'ri burchakli → **Ha**; to'g'ri burchak `√85` tomoniga qarama-qarshi uchda → **Ha** | ikkalasi ham rost (§0a.1), va ikkinchisi birinchisining DAVOMI: teorema faqat «to'g'ri burchakli» demaydi, burchakning JOYINI ham aytadi (З95). O'quvchi ikkinchisini «ortiqcha da'vo» deb rad etadi |
| 07 | G `CodeLock` | 🟡 | `code_checks` | Uch savol: katet 12 va gipotenuza 13 da ikkinchi katet (5), tomonlari `6, 8, 10` bo'lgan uchburchakda to'g'ri burchakka qarshi tomon (10), katetlari `9` va `12` bo'lganda gipotenuza (15). Kod o'sish tartibida → **5, 10, 15** | bankda `1` (`13−12`, З92), `21` (`9+12`, З91), `25` (`12+13`). Uch savol uch xil ish: ayirish, tanlash, qo'shish — bir xil harakatni uch marta takrorlab bo'lmaydi |
| 08 | D `PairSlots` | 🔴 | `verdict_pairs` | Uch uchlik ↔ uch hisob: `5,11,12 ↔ 146 ≠ 144`; `8,15,17 ↔ 289 = 289`; `4,6,7 ↔ 52 ≠ 49` | javob HISOBNING O'ZI, ya'ni «ha yoki yo'q» deb qutulib bo'lmaydi: har uchlik uchun ikki sonni chiqarish kerak. Uchinchi uchlikda ayirma juda kichik (52 va 49) va ko'z bilan «shunga o'xshaydi» deb hukm qilib bo'lmaydi |
| 09 | B `Zones` | 🔴 | `right_or_not` | 8 uchlik ikki guruhga: TO'G'RI BURCHAKLI va EMAS. To'g'ri: `3,4,5`; `9,40,41`; `20,21,29`; `12,16,20`. Emas: `4,7,8`; `8,9,12`; `11,12,15`; `6,8,11` | ikki chegara holati: `4,7,8` da 65 va 64, `8,9,12` da 145 va 144 — farq bittada. Bunday kartani faqat aniq hisob ajratadi, «katta-kichikligiga qarab» taxmin qilish ishlamaydi |
| 10 | H `ClozeBank` | 🔴 | `rule_words` | qoida: uchburchakda **eng katta** tomonning kvadrati qolgan ikki tomon kvadratlarining **yig'indisiga** teng bo'lsa, uchburchak to'g'ri burchakli, va to'g'ri burchak shu tomonga **qarama-qarshi** uchda turadi | bankda tuzoq: «eng kichik» (З94), «ko'paytmasiga», «yopishgan» (З95). Uchinchi bo'shliq teoremaning eng ko'p tashlab ketiladigan yarmi |

**Qoplov.** T1 — 02. T2 — 01, 03, 04, 06, 08, 09, 10. T3 — 01, 04, 05, 07.
З94 — 01, 04, 05, 10. З95 — 03, 06, 10. З91 va З92 — 07 ning banki, 01 ning
varianti. З96 — razborlarda (`c` va bir katet teng bo'lsa uchburchaklar teng, ikki
KATET emas). З16 — 08 va 09 butunlay hisobga tayanadi.
**Oldingi darsdan** — 07 va 09 da 44-darsning uchliklari, 02 da 44-darsning
gipotenuza ta'rifi.

**Harf.** Uchliklar ATAYLAB `a, b, c` tartibida yozilmaydi: darslikning ikkinchi
masalasi (`√85, 7, 6`) aynan shu bilan qimmat. Eng katta tomon oxirida turishi
SHART emas.

---

## 8. DARS 46 — TOMONLARIGA KO'RA BALANDLIK, GERON FORMULASI

Tasdiqlar `Dars46.jsx` dan: T1 — `p = (a+b+c) : 2`; T2 — balandlik tomonlar orqali
topiladi, va katta tomonga KICHIK balandlik mos keladi; T3 — `S = √(p(p−a)(p−b)(p−c))`,
uchala tomon ma'lum bo'lganda ishlatiladi.
Adashishlar: З16, З97 (`p` sifatida butun perimetr olindi), З98 (katta tomonga katta
balandlik deb o'ylandi).

Darslikning eslatmasi (102-bet) hisobga olingan: **formulani KELTIRIB CHIQARISH bu
darsda so'ralmaydi**, formula bo'yicha HISOBLASH so'raladi. Shuning uchun
`SwapOrder` isbotni emas, HISOBNING tartibini tekshiradi.

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `semi_perimeter_marked` | Olti yozuvdan `p` TO'G'RI hisoblangan 3 tasini belgilash: `13,14,15 → 21`; `20,20,32 → 36`; `35,29,8 → 36` | rad etilganlarning uchtasida ham perimetrning o'zi yozilgan (З97): `9,12,15 → 36`; `39,42,45 → 126`; `10,17,21 → 48`. 36 soni jadvalda UCH marta uchraydi — ikkitasi to'g'ri, bittasi xato, ya'ni songa qarab taniy olmaysiz |
| 02 | A `Choice` | 🟢 | `when_heron` | Geron formulasi qachon ishlatiladi: **«uchala tomon ma'lum bo'lganda»** | «asos va balandlik ma'lum bo'lganda» (bu 41-darsning formulasi), «faqat to'g'ri burchakli uchburchakda», «perimetr ma'lum bo'lganda» (З97 ning yaqini: perimetr yetmaydi, TOMONLAR kerak) |
| 03 | B `Zones` | 🟢 | `same_p_groups` | 8 uchlik ikki guruhga: `p = 21` va `p = 30`. 21: `12,15,15`; `6,16,20`; `10,14,18`; `9,15,18`. 30: `25,25,10`; `20,20,20`; `17,18,25`; `11,24,25` | З97: perimetrlar 42 va 60, ya'ni ikkiga bo'lmagan o'quvchi guruh nomiga hech qachon tushmaydi. Kartalarning ko'rinishi turlicha (teng yonli, teng tomonli, cho'zilgan) — yig'indi bir xil bo'lishi SHAKLDAN ko'rinmaydi |
| 04 | D `PairSlots` | 🟡 | `p_minus_side` | Uch juftlik: `13,14,15 ↔ p=21`; `p=18, a=7 ↔ p−a=11`; `p=36, c=32 ↔ p−c=4` | `p − a` ko'paytuvchisi Geron formulasining eng ko'p buziladigan joyi. Uchinchi juftlikda ayirma juda kichik (4) — cho'zilgan uchburchakda shunday bo'ladi, va bu xato emas |
| 05 | J `MatchPairs` | 🟡 | `sides_to_area` | To'rt uchlik ↔ to'rt yuza: `10,17,21 ↔ 84`; `9,12,15 ↔ 54`; `25,29,6 ↔ 60`; `45,39,12 ↔ 216` | perimetr bo'yicha tartiblab bo'lmaydi: `25,29,6` ning perimetri `10,17,21` dan katta, yuzasi esa KICHIK (cho'zilgan uchburchak). Ikkinchi uchlik to'g'ri burchakli, ya'ni uni `½·9·12` bilan ham tekshirish mumkin |
| 06 | E `TypeValue` | 🟡 | `height_from_area` | Oldingi topshiriqning uchburchagi: tomonlari 10, 17, 21 va yuzi 84. 21 tomoniga mos balandlik = **8** | `4` (`84 : 21`, ikkilantirish unutildi), `168` (`2S` ning o'zi), `16`. Razbor: `h = 2S : a`, ya'ni 41-darsning formulasi teskari yo'nalishda |
| 07 | I `SwapOrder` | 🟡 | `heron_steps` | Hisobning to'rt qadami (`11, 25, 30`): yarim perimetr (`p = 33`) → uch ayirma (`22, 8, 3`) → ko'paytma (`17424`) → ildiz (`132`) | З97 tartibda ko'rinadi: ayirmalarni `p` dan OLDIN hisoblab bo'lmaydi, chunki ular `p` dan olinadi. Ildizni oldinga surish — nimadan ildiz chiqarilayotgani ma'lum emas |
| 08 | H `ClozeBank` | 🔴 | `rule_words` | qoida: yarim perimetr uchburchak perimetrining **yarmiga** teng; Geron formulasi **uchala tomon** ma'lum bo'lganda ishlatiladi, va katta tomonga **kichik** balandlik mos keladi | bankda tuzoq: «o'ziga» (З97), «asos va balandlik», «katta» (З98). Uchinchi bo'shliq darsning eng qarshi-sezgi joyi |
| 09 | G `CodeLock` | 🔴 | `code_heron` | Bitta uchburchak (`20, 20, 32`) uchun uch savol: yarim perimetr (36), 32 tomoniga mos balandlik (12), yuza (192). Kod o'sish tartibida → **12, 36, 192** | bankda `72` (perimetr, З97), `384` (`2S`), `6` (`S : 32`, ikkilantirish unutildi). Uch javob bir-biriga bog'langan: `S` Geron bilan, `h` esa `2S : a` bilan chiqadi |
| 10 | C `TrueFalse` | 🔴 | `heron_claims` | `p = a + b + c` → **Yo'q**; `a > b` bo'lsa `hₐ > h_b` → **Yo'q** | ikkalasi ham yolg'on, lekin ular IKKI xil adashish (§0a.1): З97 va З98. Razbor har birini alohida son bilan rad etadi: `13,14,15` da `p = 21`, va o'sha uchburchakda 15 tomoniga mos balandlik 14 tomoniga mos balandlikdan KICHIK |

**Qoplov.** T1 — 01, 03, 04, 07, 08, 09, 10. T2 — 06, 08, 09, 10. T3 — 02, 05,
07, 09. З97 — 01, 02, 03, 07, 08, 09, 10. З98 — 08, 10. З16 — 05, 06, 09
butunlay hisobga tayanadi.
**Oldingi darsdan** — 06 va 09 da 41-darsning `S = ½a·h` formulasi teskari
yo'nalishda; 05 da 44-darsning `9, 12, 15` uchligi.

**Harf.** `a`, `b`, `c` — tomonlar, `p` — yarim perimetr, `hₐ` — `a` tomoniga mos
balandlik, `S` — yuza (darslikning belgilashi).

---

## 9. DARS 47 — PIFAGOR TEOREMASI BILAN MASALALAR YECHISH

Tasdiqlar `Dars47.jsx` dan: T1 — amaliy masalada Pifagor teoremasi TEKSHIRISH
vositasi (3, 4, 5 uchligi bilan burchakning to'g'ri ekanini tekshirish); T2 —
noma'lum uzunlik harf bilan belgilanadi, Pifagor tengligi yoziladi va tenglama
yechiladi; T3 — teng tomonli uchburchakning balandligi asosning YARMIGA Pifagor
teoremasini qo'llashdan topiladi, yuzi `S = (a²√3) : 4`.
Adashishlar: З16, З99 (farq noto'g'ri tomonga yozildi), З100 (to'liq asos
ishlatildi), З101 (ip teng bo'laklarga bo'lindi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `egypt_multiples` | Olti uchlikdan MISR UCHBURCHAGINING kattalashtirilgani bo'lgan 3 tasini belgilash: `3,4,5`; `6,8,10`; `9,12,15` | `5,12,13` — tuzoq: u ham to'g'ri burchakli, lekin BOSHQA uchlik, ya'ni `3:4:5` nisbatida emas. Razbor buni ochiq aytadi: ipni bo'lishda nisbat kerak, faqat to'g'ri burchaklilik emas. Qolgan ikkitasi (`4,5,6`; `6,7,8`) umuman to'g'ri burchakli emas |
| 02 | E `TypeValue` | 🟢 | `equilateral_h2` | Teng tomonli uchburchakning tomoni 10. Balandligining KVADRATI = **75** | `0` (`100 − 100`, to'liq asos olindi — З100), `125` (`100 + 25`, ayirish o'rniga qo'shish), `50`. Razbor: balandlik asosni teng ikkiga bo'ladi, ya'ni katet 5, gipotenuza 10 |
| 03 | A `Choice` | 🟢 | `half_base` | Teng tomonli uchburchakda balandlikni topish uchun Pifagor teoremasi nimaga qo'llanadi: **«yarim asos va yon tomonga»** | «to'liq asos va tomonga» (З100), «ikki tomonga», «perimetr va tomonga». Razbor `a = 10` da har variantni son bilan rad etadi |
| 04 | C `TrueFalse` | 🟡 | `rope_claims` | 12 birlik ip `4, 4, 4` ga bo'linsa, ustun tik turadi → **Yo'q**; `3, 4, 5` ga bo'linsa → **Ha** | З101. Ikki da'vo BIR xil ipni ikki xil bo'ladi, ya'ni farq faqat nisbatda. Razbor birinchisini tekshiradi: `16 + 16 = 32`, `16` emas — teng tomonli uchburchakda to'g'ri burchak yo'q |
| 05 | I `SwapOrder` | 🟡 | `letter_steps` | Darslikning masalasi (106-bet): katet 12, gipotenuza ikkinchi katetdan 6 birlik uzun. To'rt qadam: noma'lum katetni harf bilan belgilaymiz (`x`) → gipotenuzani shu harf bilan yozamiz (`x + 6`) → Pifagor tengligidan tenglama chiqaramiz (`12x = 108`) → tenglamani yechamiz (`x = 9`) | З99: `x + 6` ni KATETGA yozib qo'yish, ya'ni farqni noto'g'ri tomonga berish. Tenglamani harf belgilashdan oldin qo'yish ham xato: yozadigan narsa yo'q |
| 06 | G `CodeLock` | 🟡 | `code_tests` | Darslikning uch testi: katet 12, gipotenuza ikkinchi katetdan 6 uzun (gipotenuza 15); katet 12, ikkinchi katet gipotenuzadan 8 qisqa (gipotenuza 13); rombning diagonallari 14 va 48 (tomoni 25). Kod o'sish tartibida → **13, 15, 25** | bankda `18` (`12+6`) va `20` (`12+8`) — З99 va З91 ning aralashmasi, hamda `31` (`7+24`, yarim diagonallarni chiziqli qo'shish). Uchinchi savolda yarim diagonal olinadi |
| 07 | J `MatchPairs` | 🟡 | `figures_to_answer` | To'rt figura ↔ to'rt natija: «to'g'ri burchakli, katetlari 9 va 40» ↔ `c = 41`; «to'g'ri trapetsiya, asoslari 17 va 9, balandligi 15» ↔ `c = 17`; «teng tomonli, tomoni 6» ↔ `h = 3√3`; «kvadrat, tomoni 6» ↔ `d = 6√2` | har figurada avval TO'G'RI BURCHAKLI UCHBURCHAKNI ko'rish kerak: trapetsiyada u balandlik va asoslar ayirmasidan (`8` va `15`), teng tomonlida yarim asosdan, kvadratda esa ikki tomondan yig'iladi. Chap ustun SO'Z bilan (§0a.4) |
| 08 | H `ClozeBank` | 🔴 | `rule_words` | qoida va hisob birga: teng tomonli uchburchakda balandlik asosning **yarmiga** va yon tomonga Pifagor teoremasini qo'llashdan topiladi; `a = 10` bo'lsa `h = ` **√75**, yuzi esa `S = ` **25√3** | bankda tuzoq: «o'ziga» (З100), «√125» (ayirish o'rniga qo'shish), «50√3» (yarim unutildi). 02-topshiriqning davomi: u yerda `h²` topilgan edi, bu yerda `h` va `S` |
| 09 | D `PairSlots` | 🔴 | `rhombus_pairs` | Uch juftlik, hammasi romb haqida va yo'nalishlari boshqa: `d=16, 30 ↔ a=17`; `a=13, d=24 ↔ d=10`; `a=25, d=30 ↔ d=40` | ikkinchi va uchinchi juftlikda IKKI marta ikkiga bo'lish va ikkilantirish kerak: yarim diagonaldan tomonga, tomondan yarim diagonalga, keyin butun diagonalga. З104 naqshi (49-darsda takrorlanadi) |
| 10 | B `Zones` | 🔴 | `equation_groups` | 8 tenglama ikki guruhga: `x = 9` va `x = 12`. `x = 9`: `x² + 144 = 225`; `x² = 81`; `12x = 108`; `x² + 40² = 41²`. `x = 12`: `x² + 25 = 169`; `x² = 144`; `16x = 192`; `x² + 35² = 37²` | bitta jadvalda ikki ko'rinish: Pifagor tengligi va undan chiqqan CHIZIQLI tenglama (T2). Kvadratli tenglamada ildizni chiqarish, chiziqlisida esa bo'lish kerak — bir xil harakat ishlamaydi |

**Qoplov.** T1 — 01, 04. T2 — 05, 06, 10. T3 — 02, 03, 07, 08.
З99 — 05, 06. З100 — 02, 03, 08. З101 — 01, 04. З91 — 06 ning banki.
З16 — 02, 06, 09, 10 butunlay hisobga tayanadi.
**Oldingi darsdan** — 06 va 09 da 44-darsning rombi, 07 da 42-darsning trapetsiyasi
va 41-darsning kvadrati.

**Harf.** Noma'lum har doim `x` (darslikning belgilashi), rombda `d` — diagonal,
`a` — tomon. `8, 15, 17` uchligi 07 va 09 da IKKI boshqa figurada chiqadi — bu
ataylab: bir uchlik turli shakllarda yashiringan bo'ladi.

---
## 10. DARS 48 — AYLANA, MARKAZIY BURCHAK

Tasdiqlar `Dars48.jsx` dan: T1 — markazdan o'tuvchi vatar diametr, o'tmagani oddiy
vatar; T2 — yoyning gradus o'lchovi, u yarim aylanadan kichik yoki teng bo'lsa, mos
markaziy burchakka teng, katta bo'lsa `360°` dan markaziy burchak ayirilib topiladi;
T3 — bir xil ikki nuqta bilan chegaralangan ikki yoyning o'lchovlari yig'indisi `360°`.
Adashishlar: З16, З102 (ixtiyoriy vatar diametr deb olindi), З103 (katta yoyning
o'lchovi markaziy burchakka teng deb olindi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `arc_claims` | `∠AOB = 70°` bo'lganda kichik yoy `AB` 70° ga teng → **Ha**; katta yoy `AB` 290° ga teng → **Ha** | ikkalasi ham rost (§0a.1) va ular T2 ning ikki yarmi. O'quvchi ikkinchisini «bir yoy ikki xil o'lchovda bo'lolmaydi» deb rad etadi — razbor ikki YOY borligini aytadi: yig'indisi 360° (T3) |
| 02 | E `TypeValue` | 🟢 | `major_arc` | `∠AOB = 115°`. Katta yoy `AB` = **245** | `115` (З103: katta yoyni markaziy burchakka tenglash), `65` (`180 − 115`), `180`. Razbor: `360 − 115`, va tekshirish `115 + 245 = 360` |
| 03 | B `Zones` | 🟢 | `equal_or_subtract` | 8 yoy o'lchovi ikki guruhga: MARKAZIY BURCHAKKA TENG va `360°` DAN AYIRILADI. Teng: `60°`, `95°`, `150°`, `180°`. Ayiriladi: `200°`, `245°`, `290°`, `310°` | `180°` — CHEGARA holati: u yarim aylana, va ikki qoida bir xil javob beradi (`360 − 180 = 180`). D37_04 dagi `90°` bilan bir xil naqsh: chegara istisno emas, o'sha qoidaning alohida holi |
| 04 | G `CodeLock` | 🟡 | `code_arcs` | Uch savol: `∠AOB = 40°` da kichik yoy (40); katta yoy 260° bo'lganda markaziy burchak (100); ikki yoyning biri 250° bo'lsa, ikkinchisi (110). Kod o'sish tartibida → **40, 100, 110** | bankda `250` va `260` (shartdagi sonlar), `320` (`360 − 40`, kichik yoy uchun keraksiz ayirish). Uch savol uch yo'nalishda: tenglik, ayirish, to'ldirish |
| 05 | J `MatchPairs` | 🟡 | `angle_to_major` | To'rt markaziy burchak ↔ to'rt katta yoy: `60° ↔ 300°`; `90° ↔ 270°`; `120° ↔ 240°`; `180° ↔ 180°` | oxirgi juftlik chegara holati: yarim aylanada javob berilgan burchakka TENG chiqadi. Bu tasodif emas, `360 − 180` ning natijasi — З103 aynan shu holdan tug'iladi («demak katta yoy har doim burchakka teng») |
| 06 | F `MarkAll` 🖼 | 🟡 | `diameter_marked` | Olti aylana, har birida bitta vatar; DIAMETR bo'lgan 3 tasini belgilash | З102. Rad etilganlarning ikkitasi markazga JUDA yaqin o'tadi, lekin markazdan o'tmaydi — ta'rif «uzun vatar» demaydi, MARKAZDAN O'TISHNI talab qiladi. Uchinchisi qisqa vatar. Chizmada markaz nuqta bilan ko'rsatilgan, boshqa belgi yo'q |
| 07 | H `ClozeBank` | 🟡 | `rule_words` | qoida: markazdan o'tuvchi vatar **diametr** deyiladi; yoy yarim aylanadan kichik bo'lsa, uning gradus o'lchovi **markaziy burchakka** teng, katta bo'lsa **360°** dan markaziy burchak ayiriladi | bankda tuzoq: «radius» (vatar bilan chalkashtirish, З102), «yoyga», «180°» (yarim aylana soni ayirishga ishlatilmaydi) |
| 08 | I `SwapOrder` | 🔴 | `arc_steps` | Darslikning masalasi (108-bet), to'rt qadam: berilganni yozamiz (`∠AOB = 115°`) → kichik yoyning o'lchovi (`⌒AB = 115°`) → shart bo'yicha ikkinchi yoy ham 115°, ikkisi qo'shiladi (`⌒ABC = 230°`) → `230° > 180°`, demak `∠AOC = 360 − 230 = 130°` | З103: oxirgi qadamni tashlab, `∠AOC = 230°` deb yozish. Markaziy burchak `180°` dan katta bo'lolmaydi, va shuni oxirgi qadam ko'rsatadi. Yoylarni qo'shishni oldinga surish ham xato: qo'shiladigan ikkinchi yoy hali topilmagan |
| 09 | D `PairSlots` | 🔴 | `arc_pairs` | Uch juftlik, yo'nalishlari boshqa: `∠O=75° ↔ ⌒=285°`; `⌒=200° ↔ ∠O=160°`; `⌒=140° ↔ ∠O=140°` | uchinchi juftlik tuzoq: yoy `180°` dan KICHIK, ya'ni ayirish KERAK EMAS va javob berilganga teng. З103 ning teskarisi — «har doim ayirish» ham xato. Belgi `⌒` uch tilda bir xil o'qiladi (§0a.4) |
| 10 | A `Choice` | 🔴 | `why_subtract` | Nima uchun 250° li yoyning markaziy burchagi 250° emas: **«markaziy burchak 180° dan katta bo'lolmaydi, shuning uchun katta yoy uchun 360° dan ayiriladi»** | «yoy va burchak har xil birlikda o'lchanadi», «katta yoy burchakka teng, faqat ishorasi boshqa», «yoyning o'lchovi radiusga bog'liq» — uchtasi ham З103 ning turli niqoblari. To'g'ri javob SABABNI aytadi, qoidani takrorlamaydi |

**Qoplov.** T1 — 06, 07. T2 — 01, 02, 03, 04, 05, 07, 08, 09, 10. T3 — 01, 04, 08.
З102 — 06, 07. З103 — 02, 03, 05, 08, 09, 10. З16 — razborlar `115 + 245 = 360`
turidagi tekshirish bilan yuradi.
**Oldingi darsdan** — 01 va 05 da 37-darsning chegara holati naqshi (`90°`).

**Harf.** Markaz `O`, nuqtalar `A`, `B`, `C`, markaziy burchak `∠AOB`, yoy `⌒AB`
(darslikning belgilashi).

---

## 11. DARS 49 — AYLANA VATARI VA DIAMETRINING XOSSALARI

Tasdiqlar `Dars49.jsx` dan: T1 — vatarga perpendikulyar diametr shu vatarni va unga
tiralgan yoyni teng ikkiga bo'ladi; T2 — vatar diametridan katta bo'lmaydi; T3 —
markazdan vatargacha masofa `d`, radius `R` va vatarning YARMI Pifagor teoremasi
bilan bog'langan: `R² = d² + (vatar : 2)²`.
Adashishlar: З16, З104 (vatarning to'liq uzunligi ishlatildi), З105 (istalgan
diametr vatarni teng ikkiga bo'ladi deb o'ylandi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` 🖼 | 🟢 | `perp_diameter_marked` | Olti aylana, har birida vatar va uni kesib o'tuvchi diametr; diametr vatarni TENG IKKIGA bo'lgan 3 tasini belgilash | З105. Rad etilganlarda diametr vatarni kesadi, lekin qiya kesadi — bo'laklar teng emas. Perpendikulyarlik kvadratchasi QO'YILMAYDI: u aynan so'ralayotgan narsa (§2) |
| 02 | C `TrueFalse` | 🟢 | `chord_claims` | `R = 13`, vatar `AB = 24` da markazdan vatargacha masofa 5 → **Ha**; istalgan diametr `CD` vatar `AB` ni teng ikkiga bo'ladi → **Yo'q** | З104 va З105 bir ekranda. Birinchisi rost va uni hisob tasdiqlaydi (`169 − 144 = 25`), ikkinchisi yolg'on: faqat PERPENDIKULYAR diametr shunday bo'ladi |
| 03 | A `Choice` | 🟢 | `when_bisects` | Diametr vatarni qachon teng ikkiga bo'ladi: **«vatarga perpendikulyar bo'lganda»** | «har qanday holda» (З105), «vatar radiusga teng bo'lganda», «vatar diametrga teng bo'lganda» — oxirgisi rost, lekin u ALOHIDA hol, ya'ni javob bo'lolmaydi (shart faqat bitta vatar uchun bajariladi) |
| 04 | H `ClozeBank` | 🟡 | `rule_words` | qoida: vatarga **perpendikulyar** diametr uni va yoyni teng ikkiga bo'ladi; vatar diametridan **katta** bo'lmaydi; markazdan vatargacha masofa vatarning **yarmi** orqali topiladi | bankda tuzoq: «parallel», «kichik», «to'liq uzunligi» (З104). Ikkinchi bo'shliqda «kichik» so'zi gapga tushadi, lekin ma'noni teskari qiladi: vatar diametrga TENG bo'lishi mumkin |
| 05 | G `CodeLock` | 🟡 | `code_chords` | Uch savol: `R=10`, vatar 12 da masofa (8); `R=13`, vatar 10 da masofa (12); `R=13`, masofa 5 da vatar (24). Kod o'sish tartibida → **8, 12, 24** | bankda `5` va `26` (shartdagi son va diametr), `16`. З104: vatarning yarmini olmagan o'quvchi birinchi savolda ildiz ostida manfiy son ko'radi (`100 − 144`) — tuzoq shu yerda ochiladi |
| 06 | B `Zones` | 🟡 | `possible_chord` | `R = 10` bo'lgan aylanada 6 vatar ikki guruhga: MUMKIN va MUMKIN EMAS. Mumkin: `AB=20`, `AB=14`, `AB=8`. Mumkin emas: `AB=25`, `AB=21`, `AB=30` | T2. `AB=20` chegara: u diametrning o'zi, ya'ni MUMKIN. `AB=21` esa diametrdan bir birlik katta — «deyarli bo'ladi» degan narsa yo'q |
| 07 | E `TypeValue` | 🟡 | `distance_to_chord` | `R = 25`, vatar 48. Markazdan vatargacha masofa = **7** | `1` (`25 − 24`, chiziqli ayirish — З91), `49`, `14` (`2d`). Razbor: yarim vatar 24, `625 − 576 = 49`, ildizi 7 |
| 08 | D `PairSlots` | 🔴 | `chord_pairs` | Uch juftlik, uchi ham boshqa yo'nalishda: `R=17, AB=30 ↔ d=8`; `R=10, d=6 ↔ AB=16`; `d=9, AB=24 ↔ R=15` | uchinchi juftlikda RADIUS izlanadi, ya'ni Pifagor tengligi QO'SHISH tomonga ishlaydi (`81 + 144`). Ikkinchisida javob yarim vatar EMAS, to'liq vatar: 8 ni ikkilantirish kerak — З104 ning teskari tomoni |
| 09 | J `MatchPairs` | 🔴 | `same_radius` | To'rt juftlik, ikkitasi bir xil radiusda: `R=5, d=3 ↔ AB=8`; `R=5, d=4 ↔ AB=6`; `R=13, d=12 ↔ AB=10`; `R=13, d=5 ↔ AB=24` | bir xil aylanada masofa o'sganda vatar QISQARADI, va buni ikki juftlik yonma-yon ko'rsatadi. Aralashtirish oson: `R=13, d=12` va `R=13, d=5` ning javoblari juda boshqa (10 va 24) |
| 10 | I `SwapOrder` | 🔴 | `bisect_proof` | Isbotning to'rt qadami: radiuslarni chizamiz (`OA = OB = R`) → uchburchak teng yonli (`△AOB`) → perpendikulyar unda balandlik (`OP ⊥ AB`) → teng yonli uchburchakda balandlik mediana ham, demak `AP = PB` | З78 naqshi: xulosani (`AP = PB`) balandlik-mediana qadamidan OLDIN qo'yish. Radiuslarni oxirga surish ham xato: teng yonlilik ulardan chiqadi |

**Qoplov.** T1 — 01, 02, 03, 04, 10. T2 — 04, 06. T3 — 02, 05, 07, 08, 09.
З104 — 02, 04, 05, 07, 08. З105 — 01, 02, 03. З16 — 05, 07, 08, 09 butunlay
hisobga tayanadi.
**Oldingi darsdan** — 05, 07, 08, 09 da 44-darsning Pifagor tengligi va uchliklari
(`5-12-13`, `8-15-17`, `9-12-15`); 10 da 45-darsning natijasi (katet gipotenuzadan
kichik) razborda.

**Harf.** `R` — radius, `d` — markazdan vatargacha masofa, vatar `AB`, diametr `CD`,
kesishish nuqtasi `P` (darslikning belgilashi).

---

## 12. DARS 50 — TO'G'RI CHIZIQ VA AYLANA, URINMA

Tasdiqlar `Dars50.jsx` dan: T1 — `d > R` da umumiy nuqta yo'q, `d = R` da bitta
(urinma), `d < R` da ikkita, va kesuvchining vatari `AB = 2√(R² − d²)`; T2 — urinma
urinish nuqtasiga o'tkazilgan radiusga perpendikulyar; T3 — aylanadan tashqaridagi
bir nuqtadan o'tkazilgan ikki urinmaning uzunliklari teng.
Adashishlar: З16, З106 (birliklar bir xilga keltirilmadi), З107 (`d = R` kesuvchi
deb hisoblandi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` | 🟢 | `what_is_tangent` | Urinma qanday to'g'ri chiziq: **«aylana bilan faqat bitta umumiy nuqtasi bor»** | «aylanani kesib o'tmaydigan» (u aylanadan tashqarida ham o'tishi mumkin, ya'ni bu ta'rif kengroq), «markazdan o'tuvchi» (aksincha, urinma markazdan o'tmaydi), «radiusga parallel». Razbor: ta'rif nuqtalar SONI bilan beriladi |
| 02 | F `MarkAll` | 🟢 | `tangent_marked` | Olti holatdan URINMA bo'lgan 3 tasini belgilash: `R=6, d=6`; `R=4,5, d=4,5`; `R=12, d=12` | rad etilganlar: `R=8, d=10` (umumiy nuqta yo'q), `R=5, d=4` (kesuvchi), `R=10, d=0` (chiziq markazdan o'tadi — eng uzun vatar, urinma emas). Oxirgisi tuzoq: `d = 0` «masofa yo'q» degani emas |
| 03 | C `TrueFalse` | 🟢 | `tangent_claims` | `d = R` bo'lganda ikki umumiy nuqta bor → **Yo'q**; `d = R` bo'lganda umumiy nuqta yo'q → **Yo'q** | З107 ning IKKI TOMONI (§0a.1). Ikkala da'vo ham yolg'on, va ular bitta chegarani ikki yoqdan buzadi. To'g'ri javob ikkisining ORASIDA: aynan bitta nuqta. Razbor `R = d = 6` ni chizib ko'rsatadi |
| 04 | I `SwapOrder` | 🟡 | `tangent_proof` | «Urinma radiusga perpendikulyar» isboti, to'rt qadam: urinish nuqtasiga radius o'tkazamiz (`OA`) → chiziqda boshqa nuqta olamiz (`B ∈ l`) → u aylanadan tashqarida, ya'ni `OB > R` → `OA` eng qisqa masofa, demak `OA ⊥ l` | xulosani (`OA ⊥ l`) `OB > R` dan OLDIN qo'yish: o'shanda perpendikulyarlik hech narsadan chiqadi. Boshqa nuqtani olishni oxirga surish ham xato — solishtiradigan masofa shundan paydo bo'ladi |
| 05 | B `Zones` | 🟡 | `secant_or_not` | 8 holat ikki guruhga: KESUVCHI va KESUVCHI EMAS. Kesuvchi: `R=9,d=3`; `R=10,d=6`; `R=13,d=5`; `R=7,d=4`. Emas: `R=5,d=5`; `R=8,d=9`; `R=6,d=6`; `R=4,d=7` | ikkinchi guruh ATAYLAB ikki xil holatni birga oladi: urinma (`d = R`) va umumiy nuqtasiz (`d > R`). Razbor ularni ajratadi, lekin savol bitta: «kesuvchimi». З107 shu yerda: `d = R` ni kesuvchiga qo'yish |
| 06 | H `ClozeBank` | 🟡 | `rule_words` | qoida: aylana bilan faqat bitta umumiy nuqtasi bo'lgan to'g'ri chiziq **urinma** deyiladi; u urinish nuqtasiga o'tkazilgan radiusga **perpendikulyar**; `d = R` bo'lganda umumiy nuqta **bitta** bo'ladi | bankda tuzoq: «kesuvchi», «parallel», «ikkita» (З107) |
| 07 | J `MatchPairs` | 🟡 | `cases_to_result` | To'rt holat ↔ to'rt natija: `R=10, d=6 ↔ AB=16`; `R=10, d=10 ↔` «bitta umumiy nuqta»; `R=10, d=12 ↔` «umumiy nuqta yo'q»; `R=13, d=5 ↔ AB=24` | uchta holat BIR xil radiusda va faqat `d` o'zgaradi — trichotomiya bir ustunda ko'rinadi. Ikki natija so'z bilan, ikkitasi son bilan (`items[].label` va `tokens` aralash, §0a.4) |
| 08 | E `TypeValue` | 🔴 | `units_case` | Aylananing radiusi 1 dm, markazdan to'g'ri chiziqqacha masofa 9 sm. Umumiy nuqtalar soni = **2** | `0` (1 va 9 ni to'g'ridan-to'g'ri solishtirish — З106, aynan darslikning 424-mashqi), `1`. Razbor: `1 dm = 10 sm`, `9 < 10`, demak kesuvchi. Birliklar SETUP matnida turadi, kartada emas (§0a.4) |
| 09 | G `CodeLock` | 🔴 | `code_chords` | Uch kesuvchi vatarining uzunligi: `R=10, d=8` (12); `R=17, d=15` (16); `R=25, d=7` (48). Kod o'sish tartibida → **12, 16, 48** | bankda `6` (yarim vatar, ikkilantirish unutildi — 49-darsning З104 si), `24` (48 ning yarmi), `32`. Formula `AB = 2√(R² − d²)` — ildizdan keyin IKKILANTIRISH bor |
| 10 | D `PairSlots` | 🔴 | `three_cases` | Uch juftlik, bir xil radiusda (`R = 5`): `d=3 ↔ AB=8`; `d=5 ↔ n=1`; `d=7 ↔ n=0` | `n` — umumiy nuqtalar soni (setup aytadi). Uch holat yonma-yon: o'quvchi avval `d` ni `R` bilan solishtirishi, keyingina hisoblashi kerak. `d=7` da ildiz ostida manfiy son chiqadi — bu «hisoblab bo'lmaydi» degani emas, «kesishmaydi» degani |

**Qoplov.** T1 — 02, 03, 05, 07, 08, 09, 10. T2 — 01, 04, 06. T3 — razborlarda
(04 ning davomi: tashqi nuqtadan ikki urinma teng).
З106 — 08. З107 — 03, 05, 06, 10. З16 — 08, 09, 10 hisob bilan tekshiriladi.
**Oldingi darsdan** — 09 va 10 da 49-darsning `R² = d² + (vatar : 2)²` bog'lanishi;
04 da 45-darsning natijasi (katet gipotenuzadan kichik) asos bo'ladi.

**Harf.** `R` — radius, `d` — markazdan to'g'ri chiziqqacha masofa, `l` — to'g'ri
chiziq, urinish nuqtasi `A`, markaz `O`, `n` — umumiy nuqtalar soni.

---

## 13. NIMA O'ZGARADI UMUMIY QATLAMDA

| Fayl | O'zgarish | Sabab |
|---|---|---|
| `practice/fig.jsx` | `circ` turi qo'shiladi (additiv) | §0a.2, faqat metodist ruxsati bilan |
| `scripts/grade8-practice-seq.mjs` | `SEQ` ga 41-50 qatorlari, `check()` ning guruhlar ro'yxatiga `[41,42,43]`, `[44,45,46]`, `[47]`, `[48,49,50]` | §1, jadval haqiqat manbai |
| `scripts/grade8-practice-plan.mjs` | `PLAN_41` … `PLAN_50` va `LESSONS` qatorlari | tekshiruv javoblarni shu moduldan oladi |
| `src/lessons/grade8.js` | `grade8Amaliy` ga o'nta yozuv | reyestrsiz amaliyot ochilmaydi |
| `practice/kit.jsx` | `Head` — telefonda ixcham shart va javobdan keyin yig'iladigan shart (mexanikalarning o'zi tegilmadi) | razborga joy: §16a.3 |
| `practice/PracticeHost.jsx` | `flex: 1 0 auto` | tugma paneli razborni bosmasin: §16a.3 |
| `practice/frac.jsx` | **tegilmaydi** | ildiz va daraja allaqachon bor (§0a.5) |

**DIQQAT — bir vaqtda ikki sessiya.** Bu skelet yozilayotgan paytda repo'da
38-darsning amaliyoti yig'ilmoqda (`dars38/` fayllari 13:47 dan beri qo'shilyapti,
`dars39` va `dars40` hali bo'sh). 31-40 bloki `SEQ`, `grade8-practice-plan.mjs` va
`src/lessons/grade8.js` ga ham yozadi — `PLAN_31` … `PLAN_40` va reyestrning o'nta
yozuvi hali yo'q, ya'ni ular keyin qo'shiladi. Shuning uchun 41-50 shu uch faylga
**oxirida va nuqtali** tegadi: 38-40 tugagandan keyin, ularning yozganini
o'chirmasdan, faqat QO'SHIB. Aks holda bitta to'liq qayta yozish ikkinchi
sessiyaning ishini yo'q qiladi (`repo-parallel-sessions-hazard`).

---

## 14. TEKSHIRUV

```powershell
node scripts/grade8-practice-seq.mjs check          # taqsimot shartlari
npx vite --port 5199                                # alohida terminalda
node scripts/grade8-practice-check.mjs              # 10/10, javobdan oldin skroll yo'q, javobdan keyin razbor to'liq ko'rinadi
$env:G8_WRONG=1; node scripts/grade8-practice-check.mjs   # razbor bo'shmi
node scripts/grade8-practice-noscroll.mjs           # kadrdan chiqish yo'qmi
node scripts/grade8-practice-lang.mjs               # UZ/RU/EN uchta tilda
npx eslint src/components/grade8/practice
npm run build
```

Alohida tekshiriladigan ikki narsa:

1. **Ha/yo'q kombinatsiyalari** §0a.1 dagi jadvalga mos kelishi — `PLAN_41` … `PLAN_50`
   ning `ok` yo'llari `[data-tf="s1:yes"]` / `s1:no` ni aynan shu tartibda bosadi.
2. **`PairSlots` va `SwapOrder` ning kartalari telefonda sig'ishi** — karta 54px,
   `SwapOrder` ustuni ~85px (`grade8-practice-ten-mechanics`). Shuning uchun bu
   o'ntalikda kartalar bo'shliqsiz yozilgan (`R=13,AB=24`, `d=16,30`, `⌒=285°`) va
   `SwapOrder` ning matematikasi to'rt belgidan oshmaydi (`p = 33`, `22, 8, 3`,
   `17424`, `132`).

---

## 15. NIMA TASDIQ KUTADI

1. **§0a.2** — `fig.jsx` ga `circ` turi qo'shilsinmi (tavsiya: ha; yo'q bo'lsa
   48-06 va 49-01 yozuv bilan yig'iladi va ta'rifni tekshiradi, ko'rishni emas)?
2. **§0a.1** — ha/yo'q kombinatsiyalarining jadvali.
3. **§0a.3** — guruhlar: 41-43, 44-46, 48-50 va yolg'iz 47.
4. **§1** — o'nta tartib.
5. **§3-§12** — yuzta topshiriqning mazmuni.

Tasdiqdan keyin 2-etap: kontent (matn, razborlar, uch til), keyin 3-etap: yig'ish
(`dars41/` … `dars50/`, har birida `DNN_01.jsx` … `DNN_10.jsx` va
`DarsNNPractice.jsx`), keyin 4-etap: QA.

---

## 16. 3-ETAPDA NIMA O'ZGARDI (yig'ilgandan keyin yozildi)

Skelet tasdiqlangan holida qoldi. Yig'ish paytida oltita joyda amaliy
chetlanish bo'lgan edi; metodist ulardan uchtasini qaytardi («muammolarni
hal qil», 2026-08-25) va uchtasi hal qilindi — §16a. Bu yerda hozirgi
HOLAT yozilgan.

**1. `fig.jsx` ga `circ` qo'shildi** (§0a.2 tasdiqlandi). Aylana burchak
bilan beriladi: `chords: [{ a, b, names }]`, markaz `center` bilan
o'chiriladi. Perpendikulyarlikni hisoblash burchakdan chiqadi — vatarning
uchlari `a` va `b` bo'lsa, unga perpendikulyar diametr `(a+b)/2` burchagida
turadi. 48-06 va 49-01 shu bilan yig'ildi.

**2. 42-07 da «balandlik tashqarida» holati IKKITA** — skelet talab
qilgandek. Boshida bittasi turgan edi; hal qilindi, §16a.1.

**3. 43-01 da tomonning o'rtasi BELGILANGAN** — nuqta bilan. Boshida belgi
yo'q edi va farq ko'z bilan hal qilinardi; hal qilindi, §16a.2.

**4. Razborlar TO'LIQ** — telefon kadri uchun qisqartirilgan qirq beshta
razbor tiklandi; hal qilindi, §16a.3.

**5. 41-03 ning kadri kichraytirilgan** (100x74 dan 94x64 ga): olti chizma
razbor bilan birga telefonda sig'masdi. Figuralarning NISBATI saqlandi,
ya'ni «bir xil asos, bir xil balandlik» fakti o'sha ko'rinishda qoldi — bu
matnning yo'qolishi emas, kadrning ixchamlashishi, shuning uchun shundoq
qoldirildi.

**6. Kartalardagi so'zlar belgiga ko'chirildi.** Uch joyda karta matnida
o'zbek so'zi qolib ketgan edi (`yon = 17`, `OP — balandlik`, `at: 'kichik'`),
ya'ni ular RU va EN da tarjimasiz chiqardi. Hammasi belgiga o'tkazildi:
`c = 17`, `OP` (so'z `label` ga ko'chdi), `< 180°` va `> 180°`. Bu §0a.4
ning talabi, chetlanish emas.

---

## 16a. METODIST QAYTARGAN UCHTA MUAMMO VA YECHIMI (2026-08-25)

### 16a.1. 42-07: tashqi holat ikkita bo'ldi

Figuralar oltidan **sakkizga** chiqarildi va kadr 100x74 dan 100x52 ga
ixchamlashtirildi — kesilgan narsa chizmaning ustidagi va ostidagi BO'SH
JOY, figuraning o'zi emas. Endi:

| Belgilanadi (4 ta) | Rad etiladi (4 ta) |
|---|---|
| ichki balandlik, chap uchdan | qiya kesma (tik emas) |
| ichki balandlik, o'ng uchdan | o'rta chiziq (asoslarga PARALLEL) |
| **tashqi balandlik, chapga qiya trapetsiya** | diagonal (uchni uchga) |
| **tashqi balandlik, o'ngga qiya trapetsiya** | **yon tomonga perpendikulyar** |

Ikki tashqi holat kerak: bittasi bo'lganda o'quvchi buni bir figuraning
g'alizligi deb o'ylashi mumkin, ikki tomonga qiya holat esa bu YO'NALISHGA
bog'liq emasligini ko'rsatadi. To'rtinchi tuzoq (yon tomonga perpendikulyar)
З88 ning eng kuchli ko'rinishi: ta'rifning «tik turadi» qismi bajarilgan,
«asoslar orasida» qismi bajarilmagan. Uning perpendikulyarligi KO'RINADI —
`fig.jsx` ga `rmark` qo'shildi (ixtiyoriy nuqtadagi to'g'ri burchak
kvadratchasi), aks holda tuzoq oddiy qiya kesmadan farq qilmasdi.

To'g'ri javobning razbori to'rt tuzoqni SANAMAYDI: har biriga o'z razbori
bor (etalon §8.3), takrorlash esa razborni ikki barobar uzaytirardi.

### 16a.2. 43-01: o'rta nuqta bilan belgilanadi

`fig.jsx` ga `mids` qo'shildi: tomonning o'rtasiga siyoh rangdagi nuqta.
Nima uchun shtrix emas — shtrix «bu tomon anovi tomonga TENG» degan ma'noni
beradi, «bu nuqta o'rtasi» degan ma'noni emas; uch tomonning o'rtasini
shtrix bilan ko'rsatish uchun har tomonga boshqa sondagi shtrix kerak
bo'lardi (1, 2, 3), ya'ni 100x74 kadrda o'n ikkita belgi.

Nuqta OLTITA figuraning hammasida va UCH tomonda ham bir xil turadi, ya'ni
javobni ochib qo'ymaydi. Lekin «kesmaning uchi o'rtadami» degan savol endi
taxmin emas, tekshiruv: mediananing bir uchi nuqtada, ikkinchisi UCHDA;
chorak nuqtalardagi kesmaning uchlari nuqtalardan pastda; uchga yaqin
kesmaning uchlari nuqtaga yetmaydi. Shart va uchta razbor shunga
moslashtirildi.

### 16a.3. Razborlar: kadr endi matnni kesmaydi

Sabab. `grade8-practice-check.mjs` javobdan keyin ham «nol chiqish» talab
qilardi. 390x745 telefonda ishchi maydon 516px (sarlavha va chiplar 229px,
tugma paneli 70px), shartning o'zi 16px/1.45 da 93px yeydi. Ya'ni razborga
100-130px qolardi va uzun razbor kadrdan chiqardi — natijada qirq beshta
razbor QISQARTIRILGAN edi. Eng og'iri 47-10: to'g'ri javobning razbori 727
belgidan 69 belgiga tushgan, ya'ni to'rt kartaning hisobi butunlay
yo'qolgan. Bu kadr o'lchovining metodik matnni kesishi.

Uch qadamda hal qilindi.

1. **Matn tiklandi.** Sessiya jurnalidagi birinchi yozuvdan qirq beshta
   razbor asl holida qaytarildi (`correctText`, `wrongs[].text`,
   `wrongText`). Tiklanmadi: `setup` ning uch joyda ixchamlashtirilgani
   (47-06 va 48-04 da uzun shart `CodeLock` ning bankini pastga surib
   yuborardi, 47-07 da kartalar so'zdan belgiga o'tgan) va ichki kod bilan
   backtick olib tashlangan uch matn — ular boshqa sababdan o'zgargan.
2. **Kadrda joy ochildi** (`kit.jsx` -> `Head`): telefonda shart 14.5px/1.34
   bilan teriladi va JAVOB BERILGANDAN KEYIN bir qatorga yig'iladi
   («Shart ▾», bir teginishda qaytadi). O'quvchi shartni allaqachon
   o'qigan, razbor esa to'liq turadi. Kompyuterda hech narsa o'zgarmaydi.
3. **Joylashuvning nuqsoni tuzatildi** (`PracticeHost.jsx`): quti `flex: 1`
   (ya'ni `1 1 0%`) edi — kontent oshsa quti SIQILAR va matn pastdagi
   «Tekshirish/Qaytadan» panelining ostiga kirib ketardi. `1 0 auto` bilan
   quti kontent bo'yiga o'sadi: skroll ota-idishda paydo bo'ladi, panel
   razbordan KEYIN turadi.
4. **Uzun razbor BOSHIDAN ko'rinadi** (`PracticeHost.jsx`). Natija chiqqanda
   host pastga surar edi — bu qisqa razbor uchun to'g'ri, uzun razbor uchun
   esa yo'q: uning BOSHI ekrandan chiqib ketardi va o'quvchi matnni
   o'rtasidan o'qishga tushardi. Endi razbor kadrdan baland bo'lsa, uning
   yuqori qirrasi kadrning yuqorisiga qo'yiladi — o'qish tabiiy yo'nalishda,
   pastga qarab davom etadi. Razbor `data-razbor` belgisi bilan topiladi.
5. **Oq joy ixchamlashtirildi** (`kit.jsx`): `wrap` 4+8 dan 3+6 ga, `setup`
   ning chegarasi 5+9 dan 4+7 ga, `ask` 10+8 dan 7+6 ga. Ranglar,
   o'lchamlar va tartib tegilmadi. Bundan tashqari `CodeLock` telefonda
   ixchamroq (seyf uyasi 52px dan 48px ga, chegaralar bir-ikki piksel):
   bu eng baland mexanika va u JAVOBDAN OLDIN ham kadrni to'ldirib
   qo'yardi — 47-06 va 50-09 da 3-5px chiqish shundan edi.

6. **Past ekran ham hisobga olindi** (`kit.jsx` -> `useIsShort`). 1366x615
   noutbukda ishchi maydon 487px — telefondagidan ham kichik, lekin kenglik
   bo'yicha u «telefon» emas, ya'ni telefon uchun qilingan ixchamlik unga
   tegmasdi. Endi `CodeLock` balandligi 660px dan past ekranda ham
   ixchamlashadi (uya 62px dan 54px ga).
7. **Yig'ilgan shart qayta yig'iladi.** Tugma ikki tomonga ishlaydi
   («Shart ▾» / «Shart ▴»): o'quvchi shartni ochib qo'ygandan keyin razborga
   joyni qaytarib olishi mumkin.

To'rt shart (47-06, 47-10, 49-05, 50-09) ZICHLASHTIRILDI: fakt olib
tashlanmagan, gaplar qo'shilgan va takroriy so'zlar («Yozuvda», «Uchtasida
ham», «В записи») olingan. Bu ham javobdan OLDINGI chiqishni yopish uchun,
razbor uchun emas.

Tekshiruvning talabi ham aniqlashtirildi.

- **Javobdan oldin** — qat'iy nol chiqish, o'zgarmadi.
- **Javobdan keyin, razbor kadrga sig'sa** — to'liq ko'rinishi shart: bir
  pikseli ham kadrdan yoki sticky panelning OSTIDA qolmasin. Bu eski
  talabdan qattiqroq: eski o'lchov panel bosib turgan matnni ko'rmasdi.
- **Javobdan keyin, razbor kadrdan baland bo'lsa** — uning BOSHI ko'rinishi
  shart. Boshi kesilgan razbor nuqson bo'lib qoladi.

Ya'ni razborning uzunligi endi metodik qaror: kadr uni kesmaydi.

---

## 16b. UMUMIY QATLAMDA NIMA QO'SHILDI (yakuniy ro'yxat)

| Fayl | Nima | Kim uchun |
|---|---|---|
| `practice/fig.jsx` | `circ` (aylana), `mids` (tomonning o'rtasi), `rmark` (ixtiyoriy nuqtadagi to'g'ri burchak) | 48-06, 49-01; 43-01; 42-07 |
| `practice/kit.jsx` | `Head`: telefonda ixcham shart va javobdan keyin yig'iladigan shart | hamma mexanika, ellik dars |
| `practice/kit.jsx` | oq joy ixchamlashtirildi (`wrap`, `setup`, `ask`); `CodeLock` telefonda ixchamroq; `HFB` ga `data-razbor` | joy: §16a.3 |
| `practice/PracticeHost.jsx` | `flex: 1 0 auto` — panel matnni bosmaydi; uzun razbor boshidan ko'rinadi | hamma amaliyot |
| `scripts/grade8-practice-check.mjs` | ikki bosqichli talab: sig'sa to'liq ko'rinadi, sig'masa boshi ko'rinadi | tekshiruv |
| `scripts/grade8-practice-noscroll.mjs` | razbor talabi `check` bilan tenglashtirildi | ikki skript bir xil qoidani o'lchasin |

Oxirgi uchtasi ELLIK darsga tegadi (1-40 ham). Ularda faqat joy KO'PAYADI
va panel ostiga kirib ketgan matn ko'rinadigan bo'ladi, ya'ni o'zgarish bir
tomonga: eski razborlar qisqarmaydi, kesilmaydi.

**Tekshiruvning natijasi.** O'nta dars uchun (41-50):

- `grade8-practice-seq.mjs check` — hamma shart bajarildi (guruhlar 41-43,
  44-46, 47 yolg'iz, 48-50);
- to'g'ri yo'l: har dars 5 o'lcham x 3 til x 10 topshiriq — razbor to'liq
  ko'rinadi, ball 10/10, konsolda xato yo'q;
- `G8_WRONG=1`: har dars 10 topshiriq — ball berilmadi, razbor chiqdi va
  bo'sh emas;
- 1-40 darslarda regressiya yo'q (telefon va noutbuk kadrlarida qayta
  o'lchandi);
- `npm run build` — o'tadi; `npx eslint` — 41-50 papkalarida toza.
