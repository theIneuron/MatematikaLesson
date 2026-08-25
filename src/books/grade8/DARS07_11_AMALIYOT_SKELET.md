# 8-SINF AMALIYOTI, 7-11 DARSLAR — SKELET (1-etap)

Metodist topshirig'i 2026-08-24: **7-11 darslarning har biri 1-darsdagi AYNAN O'SHA o'nta
mexanikadan foydalanadi, lekin har darsda ketma-ketlik boshqacha.** Fon rangi, dizayn,
`kit.jsx` ning `S` / `C` / `HFB` / `Head` qatlami va chip qatori o'zgarmaydi — faqat qaysi
topshiriq qaysi mexanikada ishlashi o'zgaradi.

Bu hujjat — 1-etap (skelet). Kontent (uch tilda matn va razborlar) 2-etapda yoziladi,
faqat skelet tasdiqlangandan keyin. Davomi: `DARS02_06_AMALIYOT_SKELET.md`.

---

## 1. O'NTA MEXANIKA — 1-DARS ETALONI

| Kod | Tip | Barmoq nima qiladi | Ma'lumot kontrakti (`kit.jsx`) | Boshqaruv |
|:--:|---|---|---|---|
| A | `Choice` | to'rt variantdan bittasini bosadi | `opts[].label`, `correct`, `optCols` | yengil |
| B | `Zones` | kartani bosadi, keyin guruhni bosadi | `zones[]`, `items[{id,tokens,zone}]` — 8 karta | o'rta |
| C | `TrueFalse` | har mulohaza yonida «Ha» yoki «Yo'q» | `items[{id,tokens,at,yes,claim}]` | yengil |
| D | `PairSlots` | kartani bosadi, keyin pazl uyasini bosadi | `cards` (3 ta `tokens` + 3 ta `v`), `answer` juftliklari | og'ir |
| E | `TypeValue` | klaviaturadan BITTA BUTUN SON yozadi | `target`, `allowNeg`, `expr`, `label` | o'rta |
| F | `MarkAll` | oltita kartadan uchtasini belgilaydi | `items[{id,tokens,hit}]`, `note` | yengil |
| G | `CodeLock` | uch uyani bank sonlari bilan to'ldiradi | `cards[]` (6 son), `answer[]` (3 son, TARTIB muhim) | og'ir |
| H | `ClozeBank` | matndagi bo'shliqqa so'z qo'yadi | `parts[]`, `cards[{id,label}]`, `answer[]` | og'ir |
| I | `SwapOrder` | qatordagi ikki kartani bosib joyini almashtiradi | `cards[]`, `start`, `answer` | og'ir |
| J | `MatchPairs` | chapdan, keyin o'ngdan bosadi; chiziq tortiladi | `items[]`, `targets[]`, `answer{}`, `connect: true` | og'ir |

Uch eslatma, 1-darsda tekshirilgan:

- `E` da javob **butun son**: `TypeValue` faqat butunni oladi (`parseInt`). Kasr yoki ifoda
  javob bo'ladigan savolni bu mexanikaga bermaydi.
- `D` dagi kartalar KVADRAT (76px), demak yozuv **qisqa** bo'lishi kerak: `√(x²)`, `|x|`,
  `a = 8` sig'adi, uzun ifoda sig'maydi. `J` ning chap ustuni uzun so'zni ko'taradi.
- `G` da javob KETMA-KETLIK: to'g'ri sonlar noto'g'ri tartibda terilsa, razbor `s.set`
  orqali aynan tartib haqida gapiradi.

---

## 2. 7-11 DARSLAR: NIMA TEKSHIRILISHI SHART

Har amaliyot darsning **hamma tasdig'ini** va **hamma adashishini** qoplashi kerak
(TIPLAR §6): amaliyot — 8-sinfda yagona baholanadigan joy.

| Dars | Mavzu | Tasdiqlar (`STATEMENTS`) | Adashishlar (`MISS`) |
|---:|---|---|---|
| 7 | y = k/x va grafigi | x·y = k o'zgarmaydi; grafik giperbola, tarmoq joyini k ning ishorasi belgilaydi; nolda qiymat yo'q | З2, З16, З27, З28 |
| 8 | Arifmetik ildiz va kasr ko'rsatkich | arifmetik ildiz NOMANFIY son; a^(m/n) — bu n-darajali ildiz a^m dan; juft ildiz ostidagi kvadratdan MODUL chiqadi | З4, З5, З16, З29 |
| 9 | Kvadrat ildiz tushunchasi | ildiz — kvadrati ildiz ostiga teng nomanfiy son; har qanday nomanfiy sondan ildiz bor, lekin butun emas; butun chiqmasa ikki butun orasida turadi | З4, З16, З29, З30 |
| 10 | Arifmetik kvadrat ildiz | kvadratdan ildiz MODULni beradi; ildiz osti nomanfiy bo'lgan joyda mavjud; x² = a da ikki javob, ildiz belgisida bitta son | З16, З29, З31, З32 |
| 11 | Ildizning xossalari | kvadratga oshirish ildizni yechadi (ildiz osti nomanfiy bo'lsa); √(a²) har qanday a da, (√a)² faqat a ≥ 0 da; ildiz osti katta bo'lsa ildiz ham katta | З16, З31, З32, З33 |

---

## 3. KETMA-KETLIKLAR — BESH DARS, BESH XIL TARTIB

| Dars | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 1 (etalon) | A | B | C | D | E | F | G | H | I | J |
| 2 | C | A | B | E | D | F | G | J | H | I |
| 3 | F | C | E | J | B | I | A | D | G | H |
| 4 | A | F | C | H | G | E | B | I | J | D |
| 5 | C | B | F | I | A | J | D | H | E | G |
| 6 | F | A | C | D | H | B | J | G | I | E |
| **7** | F | C | B | E | J | A | H | G | D | I |
| **8** | A | F | E | D | C | J | B | H | I | G |
| **9** | C | B | F | H | A | I | E | D | G | J |
| **10** | F | A | C | G | B | H | I | J | E | D |
| **11** | C | E | A | J | F | D | G | I | B | H |

Qiyinlik o'qi hamma darsda o'sha: 🟢🟢🟢 · 🟡🟡🟡🟡 · 🔴🔴🔴. Qiyinlikni **misol** beradi,
mexanika emas.

Raskladka qanday tekshirilgan:

1. **1-pozitsiyada faqat yengil boshqaruv** — A, C yoki F (TIPLAR §7 p. 3).
2. **1-3 pozitsiyalarda og'ir boshqaruv yo'q**: D, G, H, I, J faqat 4-pozitsiyadan boshlab
   turadi.
3. **Oxirgi pozitsiya har darsda boshqa**: I, G, J, D, H — beshtasi ham har xil.
4. **Har mexanika besh darsda besh xil pozitsiyada turadi** — ikkita istisno bilan:
   C 9- va 11-darsda birinchi, F 7- va 10-darsda birinchi. Bu majburiy: 1-pozitsiyaga
   faqat uchta tip (A, C, F) qo'yish mumkin, dars esa beshta. Boshqa hamma tipda
   takrorlanish yo'q.
5. Hech biri 1-6 darslarning tartibi bilan ustma-ust tushmaydi.

---

## 4. ILDIZ BELGISI — USTKI CHIZIQ BILAN (metodist qarori 2026-08-24)

8-11 darslar B1 blokining oxiri va B2 blokining boshi, ya'ni ildiz belgisi birinchi marta
amaliyotga kiradi. `TIPLAR §2` bu joyni ochiq qoldirgan edi: «`frac.jsx` ning `Row` i
satrlarni va `{n,d}` ni biladi, ildizning ustki chizig'i esa yo'q».

**Qaror: ildiz USTKI CHIZIQ bilan chiziladi.** `practice/frac.jsx` ga `Root` qo'shildi va
`Row` ga yangi token turi kirdi:

```js
{ r: 'a²' }                 // √(a²) — ildiz osti chiziq ostida
{ r: '32', deg: '5' }       // 5-darajali ildiz 32 dan
{ r: [{ n: '1', d: '4' }] } // ildiz ostida kasr ham tura oladi
```

Ustki chiziq ildiz ostining CHEGARASINI ko'rsatadi: `√(a²) + 9` va `√(a² + 9)` bir-biriga
o'xshab ketmaydi. Chiziq qalinligi kasr chizig'i bilan bir xil (2px) — bir yozuvda ikki
chiziq uchrasa, ular bir xil ko'rinishi kerak. Radikal belgisi ildiz ostidan 1,16 barobar
baland: uchi chiziq bilan bir sathda turadi.

`kit.jsx` ga yangi TIP qo'shilmaydi — o'nlik o'sha (§1). Umumiy qatlamda o'zgargani ikki
narsa: `frac.jsx` (`Root`) va yangi `fig.jsx` (§4a).

## 4a. CHIZMALAR — `practice/fig.jsx` (metodist qarori 2026-08-24)

«Grafik rasmlari ham bo'lsin, usullarimizga mos holda chizmali misollar qo'sh.»

Chizma **yangi mexanika emas**, u YOZUVNING BO'LAGI: `Row` ning tokeni. Shuning uchun
chizma o'nta mexanikaning har birida tura oladi — `Choice` ning varianti, `Zones` ning
guruh sarlavhasi, `MatchPairs` ning katagi, `SwapOrder` ning kartasi, `TypeValue` ning
yozuvi bo'lib.

```js
{ fig: 'hyp', k: 6 }                    // giperbola y = 6/x, ikki tarmoq
{ fig: 'hyp', k: 6, touch: true }       // ATAYLAB xato: tarmoqlar o'qqa tegadi (З2)
{ fig: 'lin', k: 2 }                    // to'g'ri chiziq y = 2x (З27)
{ fig: 'pts', pt: { x: 2, y: 6 } }      // faqat o'qlar va nuqta, egri chiziq YO'Q
{ fig: 'axis', from: 4, to: 8, marks: [{ at: 6.5, q: true }] }   // son o'qi va «?»
```

**Nega `plot.jsx` dan olinmadi.** Dars qatlamidagi `plot.jsx` ning kadri qat'iy 420x196,
u `LangProvider` ni talab qiladi, chizmani animatsiya bilan chizadi va `PLOT_STYLES` ni
kutadi. Amaliyotda chizma karta ichida turadi: `Zones` ning sarlavhasi 92px, `Choice` ning
varianti 118px. Bu boshqa o'lcham sinfi. `plot.jsx` ni ikki o'lchamga moslash 14 darsning
chizmasiga tegish degani, metodist esa faqat 7-11 amaliyotini so'radi. Sabab `fig.jsx`
faylining shapkasida yozilgan.

**Qayerda chizma bor** (jadvallarda 🖼 belgisi bilan):

| Dars | Topshiriq | Chizma nima qiladi |
|---:|---|---|
| 7 | 03, 05, 06, 10 | tarmoq joyi guruh sarlavhasi bo'lib; nuqta koordinatasi chizmadan o'qiladi; to'rt variant — to'rt CHIZMA; qurish qadamlari kartada |
| 8 | 05 | son o'qi: −7 va 7 noldan BIR XIL masofada — modul shu yerda ko'rinadi |
| 9 | 06 | son o'qi: `√31` ikki butun son orasida, «?» bilan |
| 10 | 07 | son o'qi: 7 nuqtasi va t < 7 tomoni — modulni ochish ishorasi |
| 11 | 08 | son o'qi: 5 turadi, `√26` esa «?» — taqqoslash savoli chizmada |

Chizmada YASHIL rang yo'q: tekshiruv skripti xato javobdan keyin yashil qolganini nuqson
deb hisoblaydi, chizma esa javobdan keyin ham o'zgarmaydi.

---

## 5. DARS 7 — y = k/x FUNKSIYASI VA GRAFIGI

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `inverse_marked` | 6 yozuvdan 3 tasi teskari proporsionallik: `12/x`, `5/x`, `−7/x` | `12x` va `x/12` — to'g'ri proporsionallik (З27), `x + 5` |
| 02 | C `TrueFalse` | 🟢 | `zero_and_product` | `8/x`: «x = 0 da ma'noga ega emas» — ha; «x·y qiymati nuqtadan nuqtaga o'zgaradi» — yo'q | З2 (nol chiqarilmadi), З27 (ko'paytma o'zgarmasligini ko'rmaslik) |
| 03 🖼 | B `Zones` | 🟢 | `which_quadrants` | 8 formula karta ikki zonaga; **zona sarlavhasi — CHIZMA**: bir tarmoq juftligi 1 va 3 chorakda, ikkinchisi 2 va 4 chorakda | ishora ikki kartada YASHIRIN: `4/(−x)` va `−(−9)/x` (З28) |
| 04 | E `TypeValue` | 🟡 | `find_k` | berilgan: x = 3, y = −8. k ni yozing → **−24** | `24` (ishora tushdi), `−5` (yig'indi), `−8` (y ni k deb olish) |
| 05 🖼 | J `MatchPairs` | 🟡 | `point_to_formula` | chapda to'rt formula, **o'ngda to'rt CHIZMA**: o'qlar va bitta belgilangan nuqta — (2; 6), (−2; 6), (4; 5), (−4; 5). Egri chiziq chizilmaydi, shakli bo'yicha taniy olmaydi: k = x·y ni hisoblash kerak | k ni nisbat deb hisoblash; ishorani tashlab ketish (З28) |
| 06 🖼 | A `Choice` | 🟡 | `which_graph` | `6/x` ning grafigi qaysi — **to'rt variant to'rt CHIZMA** | to'g'ri chiziq (З27), tarmoqlar 2 va 4 chorakda (З28), tarmoqlari o'qqa TEGADIGAN chizma (З2) |
| 07 | H `ClozeBank` | 🟡 | `rule_words` | qoida: x va y ning KO'PAYTMASI o'zgarmaydi va k ga teng; grafik GIPERBOLA; nolda qiymat YO'Q | bankda tuzoq: «yig'indisi», «to'g'ri chiziq», «nolga teng» |
| 08 | G `CodeLock` | 🔴 | `table_code` | `36/x`: x = −4, 3, 6 dagi qiymatlarni o'sish tartibida → kod **−9, 6, 12** | `9` (ishora), `−6`, `18` (36 : 2) — З28 va З16 |
| 09 | D `PairSlots` | 🔴 | `same_x_pairs` | uch juft, hammasida x = −3: `24/x ↔ y = −8`; `−24/x ↔ y = 8`; `18/x ↔ y = −6` | manfiyga bo'lishda ishora; kattalikni ishoradan ajratmaslik |
| 10 🖼 | I `SwapOrder` | 🔴 | `graph_steps` | grafik qurish tartibi: aniqlanish sohasi (x ≠ 0) → jadval → nuqtalar → ikki tarmoq. **Oxirgi ikki kartada CHIZMA**: nuqtalar va tarmoqlar | sohani oxirga surish; jadvalsiz to'g'ri chizishga o'tish |

**Qoplov.** 1-tasdiq: 02, 04, 05, 09. 2-tasdiq: 03, 06, 07, 10. 3-tasdiq: 02, 06, 07, 10.
З2 — 02, 06, 10; З27 — 01, 02, 06; З28 — 03, 04, 05, 06, 08, 09; З16 — razborlar hammasida
son qo'yishga yuboradi.

**Chizma qayerda ishlaydi.** Dars grafik darsi, o'nlikda esa chizmani BOSADIGAN mexanika
yo'q (TIPLAR §5.10 `figure` — 37-darsdan). Metodist qarori bilan chizma boshqa yo'ldan
kirdi: u yozuvning bo'lagi bo'lib mexanikalar ichida turadi (§4a). Shuning uchun bu darsda
o'quvchi chizmani O'QIYDI va u bilan qaror qabul qiladi — guruhni chizma bo'yicha tanlaydi
(03), nuqtaning koordinatasini chizmadan oladi (05), to'rt chizmadan bittasini tanlaydi
(06), qadamlarni chizma bilan tartiblaydi (10). Chizmaning ustiga BOSISH (nuqta qo'yish,
tarmoq tanlash) hali yo'q — bu 37-darsdan keladigan `figure` tipining ishi.

---

## 6. DARS 8 — ARIFMETIK ILDIZ VA KASR KO'RSATKICHLI DARAJA

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` | 🟢 | `one_number` | `√16` nimaga teng: **4** | `±4` (З29), `−4`, `8` (16 : 2) |
| 02 | F `MarkAll` | 🟢 | `power_root_marked` | 6 tenglikdan 3 tasi to'g'ri: `9^(1/2) = 3`, `8^(1/3) = 2`, `16^(1/4) = 2` | `9^(1/2) = 4,5` va `25^(1/2) = 12,5` — ko'rsatkichni bo'lish deb olish; `8^(1/3) = 24` |
| 03 | E `TypeValue` | 🟢 | `power_value` | `64^(2/3)` → **16** | `4` (faqat ildiz), `8` (`64^(1/2)`), `128` (64 · 2) |
| 04 | D `PairSlots` | 🟡 | `power_to_root` | uch juft: `5^(1/2) ↔ √5`; `5^(3/2) ↔ √(5³)`; `5^(2/3) ↔ ∛(5²)` | surat va maxrajni almashtirish: SURAT ildiz ostiga, MAXRAJ ildiz darajasiga ketadi |
| 05 🖼 | C `TrueFalse` | 🟡 | `root_claims` | «`√(9 + 16) = 3 + 4`» — yo'q; «`√((−7)²) = 7`» — ha. **Yozuv ustida CHIZMA**: son o'qida −7 va 7 noldan bir xil masofada — modul shu yerda ko'rinadi | З4 (ildiz hadlarga bo'lindi), З5 (modul tushib qoldi) |
| 06 | J `MatchPairs` | 🟡 | `power_to_value` | to'rt yozuv ↔ to'rt qiymat: `8^(1/3) ↔ 2`; `81^(1/4) ↔ 3`; `64^(1/3) ↔ 4`; `81^(1/2) ↔ 9` | asos katta bo'lsa qiymat ham katta deb o'ylash; ko'rsatkichga qaramaslik |
| 07 | B `Zones` | 🟡 | `modulus_or_not` | 8 karta: natija MODUL / natija ifodaning O'ZI. Juft daraja — `√(a²)`, `⁴√(a⁴)`, `⁶√(a⁶)`, `⁴√((a+2)⁴)`; toq — `∛(a³)`, `⁵√(a⁵)`, `⁷√(a⁷)`, `∛((a−5)³)` | З5: daraja juftligiga qaramaslik |
| 08 | H `ClozeBank` | 🔴 | `rule_words` | qoida: arifmetik ildiz — NOMANFIY son, uning n-darajasi ildiz ostiga teng; kasr ko'rsatkichda MAXRAJ ildiz darajasi, SURAT ildiz ostidagi daraja | bankda tuzoq: «musbat», «ikkita son», surat va maxrajning o'rni |
| 09 | I `SwapOrder` | 🔴 | `power_steps` | `32^(3/5)` ni hisoblash tartibi: kasr ko'rsatkichni ildizga o'tkazish → `⁵√32 = 2` → kubga oshirish → **8** | avval kubga oshirib keyin ildiz olishga urinish (32³ — hisoblab bo'lmaydigan son) |
| 10 | G `CodeLock` | 🔴 | `code_powers` | `16^(1/2)`, `27^(2/3)`, `81^(3/4)` qiymatlari o'sish tartibida → kod **4, 9, 27** | `8`, `18`, `32` — ko'rsatkichni ko'paytirish yoki bo'lish |

**Qoplov.** 1-tasdiq: 01, 05, 08. 2-tasdiq: 02, 03, 04, 06, 09, 10. 3-tasdiq: 05, 07, 08.
З4 — 05; З5 — 05, 07; З29 — 01, 08; З16 — razborlar son bilan rad etadi.

---

## 7. DARS 9 — KVADRAT ILDIZ TUSHUNCHASI

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `root_exists_claims` | «`√10` ning qiymati yo'q» — yo'q; «`√49 = 7`» — ha | З30 (ildiz faqat to'liq kvadratda bor), З29 (javob ±7 deb o'ylash) |
| 02 | B `Zones` | 🟢 | `whole_or_not` | 8 karta: ildiz butun chiqadi / chiqmaydi. Butun: `√36`, `√81`, `√121`, `√144`; butun emas: `√10`, `√30`, `√50`, `√200` | `√121` to'liq kvadratga o'xshamaydi; `√50` esa o'xshaydi (5 · 10) |
| 03 | F `MarkAll` | 🟢 | `has_value` | 6 yozuvdan 3 tasining qiymati bor: `√0`, `√7`, `√121` | `√(−4)`, `√(−1)`, `√(−100)` — ildiz osti manfiy; `√7` ni «butun emas, demak yo'q» deb tashlash (З30) |
| 04 | H `ClozeBank` | 🟡 | `rule_words` | qoida: kvadrat ildiz — kvadrati ildiz ostiga teng NOMANFIY son; MANFIY sondan kvadrat ildiz olinmaydi; butun chiqmasa ildiz ikki BUTUN son orasida turadi | bankda tuzoq: «musbat», «ikkita son», «har qanday» |
| 05 | A `Choice` | 🟡 | `between_which` | `√54` qaysi ikki butun son orasida: **7 va 8** | `6 va 7`, `8 va 9`, `27 va 28` (54 : 2) |
| 06 🖼 | I `SwapOrder` | 🟡 | `refine_steps` | **Chizma**: son o'qida 5 va 6, orasida «?». `√31` ni aniqlash tartibi: butun chegaralar (5 va 6) → `5,5² = 30,25` → `5,6² = 31,36` → `5,5 < √31 < 5,6` | tekshirishni kvadratga oshirmasdan «taxminan» qilish (З16) |
| 07 | E `TypeValue` | 🟡 | `count_whole` | 1 dan 50 gacha nechta n uchun `√n` butun bo'ladi → **7** | `50` (hammasida butun deb o'ylash), `25`, `6` (49 ni tashlab ketish) |
| 08 | D `PairSlots` | 🔴 | `root_to_bounds` | uch juft: `√20 ↔ 4 va 5`; `√40 ↔ 6 va 7`; `√90 ↔ 9 va 10` | ildiz ostini ikkiga bo'lish (`√40 → 20`); chegarani kvadrat bilan tekshirmaslik |
| 09 | G `CodeLock` | 🔴 | `code_roots` | `√9`, `√64`, `√225` qiymatlari o'sish tartibida → kod **3, 8, 15** | `4,5` va `32` — ildiz ostini ikkiga bo'lish; `112` |
| 10 | J `MatchPairs` | 🔴 | `fact_to_record` | to'rt ma'lumot ↔ to'rt yozuv: «qiymati butun» ↔ `√196`; «5 va 6 orasida» ↔ `√27`; «qiymati yo'q» ↔ `√(−9)`; «qiymati nolga teng» ↔ `√0` | `√0` ni «qiymati yo'q» ga qo'shish; `√196` ni butun emas deb o'ylash |

**Qoplov.** 1-tasdiq: 01, 04, 10. 2-tasdiq: 02, 03, 04, 07, 10. 3-tasdiq: 05, 06, 08, 09.
З29 — 01, 04; З30 — 01, 03, 07; З4 — 08 razborida (`√40` ni hadlarga ajratish);
З16 — 06, 08, 09 razborlari son bilan tekshirishga yuboradi.

---

## 8. DARS 10 — ARIFMETIK KVADRAT ILDIZ

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `defined_marked` | 6 yozuvdan 3 tasining qiymati bor: `√((−6)²)`, `√0`, `√(3² + 4²)` | `√(−16)`, `√(−1)`, `√(2 − 9)` — ildiz osti manfiy (З32); `√((−6)²)` ni manfiy deb o'ylash |
| 02 | A `Choice` | 🟢 | `square_of_negative` | `√((−9)²)` nimaga teng: **9** | `−9` (З31), `±9` (З29), `81` (ildizni olmaslik) |
| 03 | C `TrueFalse` | 🟢 | `two_answers_claims` | «`x² = 49` ning ikki yechimi bor» — ha; «`√49 = ±7`» — yo'q | З29: tenglamaning ikki javobi bilan ildiz belgisining bitta sonini aralashtirish |
| 04 | G `CodeLock` | 🟡 | `code_modulus` | `√(a²)` ning qiymati a = −5, a = 0, a = 8 da; o'sish tartibida → kod **0, 5, 8** | `−5` va `−8` (З31: modul tushdi), `25` (kvadratni qoldirish) |
| 05 | B `Zones` | 🟡 | `exists_always_or_never` | 8 karta: har qanday c da mavjud / hech qanday c da mavjud emas. Mavjud: `√(c²)`, `√(c² + 1)`, `√((c − 3)²)`, `√(c⁴)`; mavjud emas: `√(−c² − 4)`, `√(−9)`, `√(−(5²))`, `√(1 − 4)` | `√(c⁴)` ni juft daraja emas deb o'ylash; `−c² − 4` musbat bo'lishi mumkin deb o'ylash (З32) |
| 06 | H `ClozeBank` | 🟡 | `rule_words` | qoida: kvadratdan olingan ildiz sonning MODULINI beradi; ildiz ostidagi ifoda NOMANFIY bo'lishi kerak; `x² = a` da IKKI javob, ildiz belgisida BITTA son | bankda tuzoq: «o'zini», «musbat», «ikkita» |
| 07 🖼 | I `SwapOrder` | 🟡 | `modulus_steps` | **Chizma**: son o'qida 7 nuqtasi va t < 7 tomoni. `√((t − 7)²)` ni hisoblash tartibi: modulga o'tish `|t − 7|` → ishorani aniqlash (t − 7 < 0) → modulni ochish `7 − t` → javob | ishorani aniqlamasdan modulni ochish (З31); modulni umuman yozmaslik |
| 08 | J `MatchPairs` | 🔴 | `record_to_domain` | to'rt ma'lumot ↔ to'rt yozuv: «har qanday p da» ↔ `√(p²)`; «faqat p ≥ 0 da» ↔ `√p`; «faqat bitta qiymatda» ↔ `√(−p²)`; «hech qanday qiymatda» ↔ `√(−p² − 1)` | `√(−p²)` ni butunlay mavjud emas deb o'ylash — p = 0 da bor (З32) |
| 09 | E `TypeValue` | 🔴 | `smallest_x` | `√(2x − 10)` ma'noga ega bo'ladigan eng kichik x → **5** | `10` (ko'paytuvchini unutish), `0`, `−5` (ishora) — З32 |
| 10 | D `PairSlots` | 🔴 | `record_pairs` | uch juft: `√(x²) ↔ |x|`; `√(x⁴) ↔ x²`; `(√x)² ↔ x` | `√(x⁴)` ga modul qo'yish (x² allaqachon nomanfiy); `(√x)²` da shartni ko'rmaslik |

**Qoplov.** 1-tasdiq: 02, 04, 07, 10. 2-tasdiq: 01, 05, 08, 09, 10. 3-tasdiq: 03, 06.
З29 — 02, 03; З31 — 02, 04, 07, 10; З32 — 01, 05, 08, 09; З16 — 04 va 09 razborlari.

---

## 9. DARS 11 — ARIFMETIK KVADRAT ILDIZNING XOSSALARI

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `compare_claims` | «`√17 > 4`» — ha; «`√30 > 6`» — yo'q | З33: kvadratlarga o'tmasdan qarash (16 < 17, lekin 36 > 30) |
| 02 | E `TypeValue` | 🟢 | `square_undo` | `(√13)²` → **13** | `169` (13 ni kvadratga oshirish), `26`, `3` |
| 03 | A `Choice` | 🟢 | `which_bigger` | 5 va `√26` — qaysi biri katta: **`√26`** | «5 katta», «teng», «taqqoslash mumkin emas» (З33) |
| 04 | J `MatchPairs` | 🟡 | `record_to_condition` | to'rt yozuv ↔ to'rt shart: `√(d²) ↔ har qanday d`; `(√d)² ↔ d ≥ 0`; `√(−d) ↔ d ≤ 0`; `√(d − 2) ↔ d ≥ 2` | `√(−d)` ni umuman ma'nosiz deb o'ylash; `√(d²)` ga shart qo'yish (З32) |
| 05 | F `MarkAll` | 🟡 | `always_true_marked` | 6 tenglikdan 3 tasi HAR QANDAY f da to'g'ri: `√(f²) = |f|`, `√(f⁴) = f²`, `√(9f²) = 3|f|` | `(√f)² = f` va `√(f²) = f` — faqat f ≥ 0 da (З31); `√(f² + 16) = f + 4` (З4) |
| 06 | D `PairSlots` | 🟡 | `value_pairs` | uch juft: `√(3² + 4²) ↔ 5`; `(√11)² ↔ 11`; `√((−9)²) ↔ 9` | `√(3² + 4²)` dan 7 chiqarish (З4); `√((−9)²)` dan −9 (З31) |
| 07 | G `CodeLock` | 🔴 | `code_integer_part` | `√8`, `√27`, `√50` ning butun qismlari (o'sha tartibda) → kod **2, 5, 7** | `4`, `13`, `25` — ildiz ostini ikkiga bo'lish; `√8` uchun `3` — chegarani kvadrat bilan tekshirmaslik |
| 08 🖼 | I `SwapOrder` | 🔴 | `compare_steps` | **Chizma**: son o'qida 5 turadi, `√26` esa «?» bilan. Taqqoslash tartibi: ikkalasini kvadratga oshirish → 26 va 25 → 26 > 25 → `√26 > 5` | xulosani boshiga qo'yish; kvadratga oshirish qadamini tashlab ketish (З33) |
| 09 | B `Zones` | 🔴 | `always_or_sometimes` | 8 tenglik ikki zonaga: har qanday g da to'g'ri / faqat ba'zi g da to'g'ri. Har qanday: `√(g²) = |g|`, `√(g⁴) = g²`, `√(36g²) = 6|g|`, `√((g − 4)²) = |g − 4|`; ba'zi: `√(g²) = g`, `(√g)² = g`, `√(g² + 9) = g + 3`, `√(g²) = −g` | З31 (modul tushdi), З4 (`√(g² + 9)` hadlarga bo'lindi); `√(g²) = −g` g ≤ 0 da to'g'ri — «minus, demak yolg'on» degan xulosa |
| 10 | H `ClozeBank` | 🔴 | `rule_words` | qoida: kvadratga oshirish ildizni YECHADI, lekin ildiz osti NOMANFIY bo'lganda; `√(a²)` HAR QANDAY a da ma'noga ega; ildiz osti KATTA bo'lsa ildiz ham KATTA | bankda tuzoq: «har doim», «musbat», «kichik» |

**Qoplov.** 1-tasdiq: 02, 04, 05, 09, 10. 2-tasdiq: 04, 05, 06, 09, 10. 3-tasdiq: 01, 03,
07, 08, 10. З31 — 05, 06, 09; З32 — 04, 10; З33 — 01, 03, 07, 08; З16 — 07 va 08 razborlari.

---

## 10. UMUMIY QOIDALAR (hamma besh darsga)

1. **Harf har topshiriqda boshqacha**: 8-darsda a n, 9-darsda n, 10-darsda a c p t x,
   11-darsda d f g. **7-darsda istisno**: mavzuning o'zi x va y ni belgilagan, shuning
   uchun bu darsda harf emas, **k qiymatlari** takrorlanmaydi (12, 8, 7, −24, ±12, ±20,
   36, 24, 18).
2. **Sonli misol dars ichida takrorlanmaydi** (TIPLAR §7 p. 6). Bir darsda `√16` ham
   birinchi, ham beshinchi topshiriqda turmaydi.
3. **Uch til**: UZ (`siz`, ASCII `'`), RU (`ты`), EN. UZ satrida kirill yo'q.
4. **Razbor har xato yo'lga alohida**, javobni aytmaydi — belgiga ishora qiladi va
   **son bilan rad etadi** (З16 ning qopqog'i).
5. **`kit.jsx` ga yangi tip qo'shilmaydi, `frac.jsx` tegilmaydi.** Ildiz — satr tokeni
   (§4). Faqat ma'lumot fayllari (`D0N_MM.jsx`) va yig'uvchi (`DarsNNPractice.jsx`)
   yoziladi: dars boshiga 11 fayl.
6. **Dizayn tegilmaydi**: fon `#fff7ed`, urg'u `#fe5b1a`, `S` / `C` / `HFB` / `Head`, chip
   qatori — o'sha.
7. **Reyestr**: `src/lessons/grade8.js` ning `grade8Amaliy` massiviga besh yozuv
   (`dars07-amaliyot` … `dars11-amaliyot`). `src/lessons/index.js` ga tegish kerak emas —
   `amaliy` bo'limi allaqachon ro'yxatdan o'tgan.
8. **Tekshiruv**: `scripts/grade8-practice-plan.mjs` ga `PLAN_07` … `PLAN_11` qo'shiladi
   (`ok` va `no` qadamlari), keyin `grade8-practice-check.mjs` ikki yo'lda ham toza
   bo'lishi kerak — to'g'ri javoblarda 10/10, noto'g'rida 0/10 va bo'sh bo'lmagan razbor,
   15 ta o'lcham va til sochetaniyasida skrollsiz.

---

## 11. OCHIQ MASALA: 3-6 DARSLAR HOZIR BOSHQA O'NTALIKDA

`DARS02_06_AMALIYOT_SKELET.md` §2 bo'yicha 2-6 darslar ham 1-darsning o'nta mexanikasiga
o'tishi kerak edi. Amalda faqat **2-dars** o'tgan (`TrueFalse`, `Choice`, `Zones`,
`TypeValue`, `PairSlots`, `MarkAll`, `CodeLock`, `MatchPairs`, `ClozeBank`, `SwapOrder`).
3, 4, 5 va 6-darslar hozir eski o'ntalikda turadi: `SlotsBank`, `HoleSlider`, `OrderLines`,
`StrikeOut`, `NumberLine`, `RepairPart`, `TypeExpr`, `Choice`, `Zones`, `MatchPairs`.

Ya'ni bu skelet bajarilgandan keyin sinfda **ikki xil o'ntalik** qoladi: 1, 2, 7-11 —
yangisida; 3-6 — eskisida. Bu holat tuzatilishi kerak, lekin **hozirgi topshiriqning
ichida emas**: 7-11 so'ralgan. Metodist qachon aytsa, 3-6 ham shu o'ntalikka
ko'chiriladi — tartiblari §3 jadvalida allaqachon turadi.

---

## 12. METODIST QARORLARI 2026-08-24 — SKELET TASDIQLANDI

1. **Ketma-ketliklar jadvali** (§3) — shundayligicha qabul qilindi.
2. **Ildiz USTKI CHIZIQ bilan** (§4): `frac.jsx` ga `Root` yozildi, `{ r: … }` tokeni
   kirdi. Satr ko'rinishidagi `'√16'` dan voz kechildi.
3. **Chizmalar bo'ladi** (§4a): «grafik rasmlari ham bo'lsin, usullarimizga mos holda
   chizmali misollar qo'sh». `practice/fig.jsx` yozildi, chizma yozuvning tokeni bo'lib
   o'nta mexanikaning ichida turadi. 7-darsda to'rt topshiriq chizmali, 8-11 da bittasi.
4. **Faqat 7-11 darslar**: 3-6 darslar (§11) tegilmaydi.

2-etap va 3-etap shundan keyin boshlandi: har dars uchun kontent (UZ/RU/EN + razborlar),
sborka, reyestr, tekshiruv rejasi va QA — darsma-dars, 7-darsdan.

---

## 13. BAJARILDI (2026-08-24)

Besh dars ham yig'ildi va tekshirildi. 55 fayl: har darsda o'nta ma'lumot fayli va bitta
yig'uvchi.

| Dars | Papka | Reyestr | Tekshiruv rejasi |
|---:|---|---|---|
| 7 | `practice/dars07/` | `dars07-amaliyot` | `PLAN_07` |
| 8 | `practice/dars08/` | `dars08-amaliyot` | `PLAN_08` |
| 9 | `practice/dars09/` | `dars09-amaliyot` | `PLAN_09` |
| 10 | `practice/dars10/` | `dars10-amaliyot` | `PLAN_10` |
| 11 | `practice/dars11/` | `dars11-amaliyot` | `PLAN_11` |

**Umumiy qatlamda o'zgargani** (uch joy, hammasi bir marta):

1. `practice/frac.jsx` — `Root` (ildiz, ustki chiziq bilan) va `Pow` (kasr ko'rsatkichli
   daraja, ikki qavatli kasr ko'rsatkich). `Row` ga uch yangi token: `{ r }`, `{ b, e }`,
   `{ fig }`.
2. `practice/fig.jsx` — YANGI fayl, chizmalar: `hyp`, `lin`, `pts`, `axis`.
3. `practice/kit.jsx` — `PairSlots` da uchta qo'shimcha: karta `side` ni ochiq aytadi
   (ikki tomon ham matematika bo'lganda), `cardSizePhone` va `faceSizePhone` (telefonda
   o'lcham alohida — 8-darsning kasr ko'rsatkichi 54px kartada o'qilmasdi).
   **Yangi TIP qo'shilmadi**, o'nlik o'sha.

**Tekshiruvlar (2026-08-24):**

- `grade8-practice-check.mjs` — har besh dars uchun 150 o'tish (5 o'lcham x 3 til x 10
  topshiriq): to'g'ri yo'lda 10/10 va skrollsiz, `G8_WRONG=1` da 0/10, razbor bo'sh emas
  va yashil rang qolmaydi. Ikki yo'lda ham toza.
- 1-6 darslar regressiyasi: umumiy qatlam o'zgargani uchun qayta o'tkazildi, toza.
- `grade8-practice-lang.mjs` — UZ satrlarda kirillcha yo'q, apostroflar ASCII.
- `npx eslint src/components/grade8/practice/dars07..dars11` — toza.
- `npm run build` — o'tadi.

**Yo'l-yo'lakay o'lchov bilan tuzatilgan uch joy** (hammasi tekshiruv ko'rsatgan):
7-darsning 05-topshirig'ida chizmalar balandligi 9-21px kadrdan chiqargan edi — chizma
kichraytirildi; 8-darsning 04-topshirig'ida telefonda karta tugma tagiga surilib bosilmay
qolgan edi — `cardSizePhone` shundan paydo bo'ldi; 9-darsning 03-topshirig'ida rus tilidagi
razbor telefonda 18px chiqargan edi — matn qisqartirildi.
