# 8-SINF AMALIYOTI, 2-6 DARSLAR — SKELET (1-etap)

Metodist topshirig'i 2026-08-24: **2-6 darslarning har biri 1-darsdagi AYNAN O'SHA o'nta
mexanikadan foydalanadi, lekin har darsda ketma-ketlik boshqacha.** Fon rangi, dizayn,
`kit.jsx` ning `S`/`C`/`HFB`/`Head` qatlami o'zgarmaydi — faqat qaysi topshiriq qaysi
mexanikada ishlashi o'zgaradi.

Bu hujjat — 1-etap (skelet). Kontent (uch tilda matn, razborlar) 2-etapda yoziladi,
faqat skelet tasdiqlangandan keyin.

---

## 1. O'NTA MEXANIKA — 1-DARS ETALONI

| Kod | Tip | Barmoq nima qiladi | Qanday matematikani ko'taradi |
|:--:|---|---|---|
| A | `Choice` | to'rt variantdan bittasini bosadi | to'liq javob (yozuv + shart), «qaysi amal birinchi» |
| B | `Zones` | kartani bosadi, keyin guruhni bosadi | «to'g'ri / noto'g'ri», «qisqaradi / qisqarmaydi» — 8 karta |
| C | `TrueFalse` | har mulohaza yonida «Ha» yoki «Yo'q» | ikki qimmat adashishni yuzma-yuz qo'yish |
| D | `PairSlots` | kartani bosadi, keyin pazl uyasini bosadi | uch juftlik: ifoda ↔ javob yoki ifoda ↔ shart |
| E | `TypeValue` | klaviaturadan BITTA SON yozadi | «yashirin shart», «eng katta taqiq», «teshik qayerda» |
| F | `MarkAll` | oltita kartadan uchtasini belgilaydi | «hammasi yoki hech narsa» tanish |
| G | `CodeLock` | uch uyani bank sonlari bilan to'ldiradi | taqiqlar TO'PLAMI, o'sish tartibida |
| H | `ClozeBank` | matndagi bo'shliqqa so'z qo'yadi | darsning QOIDASI so'z bilan |
| I | `SwapOrder` | qatordagi ikki kartani bosib joyini almashtiradi | yechim qadamlari tartibi |
| J | `MatchPairs` | chapdan, keyin o'ngdan bosadi; chiziq tortiladi | to'rt yozuv ↔ to'rt shart / natija |

Yengil boshqaruv (bitta bosish): A, C, F. **1-pozitsiyada faqat shulardan biri turadi**
(TIPLAR §7: boshlashda boshqaruv tushuntirishni talab qilmasin).
Og'ir boshqaruv (ikki bosish yoki yozish): D, G, H, I, J — ular 🟡 va 🔴 zonada.

---

## 2. KETMA-KETLIKLAR — BESH DARS, BESH XIL TARTIB

| Dars | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 1 (etalon) | A | B | C | D | E | F | G | H | I | J |
| **2** | C | A | B | E | D | F | G | J | H | I |
| **3** | F | C | E | J | B | I | A | D | G | H |
| **4** | A | F | C | H | G | E | B | I | J | D |
| **5** | C | B | F | I | A | J | D | H | E | G |
| **6** | F | A | C | D | H | B | J | G | I | E |

Qiyinlik o'qi hamma darsda o'sha: 🟢🟢🟢 · 🟡🟡🟡🟡 · 🔴🔴🔴.
Oxirgi pozitsiyada har darsda boshqa tip turadi: J, I, H, D, G, E — takrorlanish yo'q.

---

## 3. NIMA YO'QOLADI VA NIMA BILAN QOPLANADI

2-6 darslarda hozir ishlagan yettita tip chiqib ketadi. Bu yo'qotish ochiq aytiladi:

| Chiqadi | Nima qilardi | Nima bilan qoplanadi |
|---|---|---|
| `TypeExpr` | o'quvchi IFODANI o'zi yozardi (`p/(p+8)`) | `TypeValue` — faqat SON yoziladi; ifoda esa `D`, `A`, `J` da tanlanadi |
| `SlotsBank` | yechim zanjirining bo'shliqlariga matematik karta | `G` (kod) va `H` (so'z) |
| `HoleSlider` | slayderni surib «teshik» ni topish | `E` — o'sha son klaviaturadan yoziladi |
| `OrderLines` | bankdan yechim satrlarini yig'ish | `I` — satrlar bor, joyi almashtiriladi |
| `StrikeOut` | barmoq bilan qisqartirish (chizib tashlash) | `F` — qisqaradiganini belgilash |
| `NumberLine` | o'qdagi taqiqlangan nuqtalar | `G` — o'sha taqiqlar kod bo'lib yoziladi |
| `RepairPart` | javobdagi XATO bo'lakni topib tuzatish | `A` va `C` — xato yozuv variant yoki mulohaza bo'lib keladi |

**Eng qimmat yo'qotish — `TypeExpr`.** Ifodani o'z qo'li bilan yozish tanlashdan kuchli
dalil. 1-darsda bu tip yo'q, shuning uchun topshiriq bo'yicha u 2-6 darslardan ham ketadi.
Agar ifoda yozishni saqlash kerak bo'lsa, ikki yo'l bor: (1) o'nlikka `TypeExpr` ni
kiritish — bu 1-darsni ham o'zgartiradi; (2) hozirgicha qoldirish. Qaror metodistning.

Matematik mazmun bo'yicha yo'qotish yo'q: har dars uchun o'nta savol saqlanadi, faqat
ba'zilari boshqa shaklga o'tadi (masalan 2-darsda zanjir bo'shliqlari o'rniga qoida so'z
bilan, `banned_points` esa kod bo'lib).

---

## 4. DARS 2 — KASRNING ASOSIY XOSSASI

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `property_claims` | `a/(a+3) = 3a/(3(a+3))` — ha; `a/(a+3) = (a+4)/((a+3)+4)` — yo'q | «qo'shsak ham qiymat o'zgarmaydi» |
| 02 | A `Choice` | 🟢 | `full_answer_choice` | `6/(m+5)` ni `m²+5m` maxrajiga keltirish; javobda yozuv ham, shart ham | shartsiz javob; `m ≠ 0` tushib qolishi |
| 03 | B `Zones` | 🟢 | `property_held` | 8 karta: xossa bajarildi / buzildi (`a·0/((a+3)·0)` ham bor) | nolga ko'paytirish; qo'shish |
| 04 | E `TypeValue` | 🟡 | `new_ban_value` | `3/(k+1)` ni `(k−4)` ga ko'paytirdik: qanday `k` da YANGI taqiq paydo bo'ldi → **4** | «taqiq faqat dastlabki maxrajdan» |
| 05 | D `PairSlots` | 🟡 | `missing_numerator` | `4/(3y)` uch maxrajga keltirildi, maxraj ↔ surat: `15y²↔20y`, `12y²↔16y`, `9y³↔12y²` | `12y²` ikki joyda turadi — o'xshashlik bo'yicha juftlash |
| 06 | F `MarkAll` | 🟡 | `made_by_property` | 6 kasrdan 3 tasi xossa bilan yasalgan: ko'paytuvchi qavs, son va harf ko'rinishida | `(5+q)/(7+q)`, `(q−5)/(q−7)` — qo'shiluvchi ko'paytuvchi emas |
| 07 | G `CodeLock` | 🟡 | `banned_points` | `5(t+3)/(t(t+3)(t−6))` → kod **−3, 0, 6** | qisqargandan keyin `−3` ko'rinmaydi, lekin qoladi |
| 08 | J `MatchPairs` | 🔴 | `record_to_condition` | `7p/4p ↔ p≠0`; `7(p−3)/4(p−3) ↔ p≠3`; `7(p²−9)/4(p²−9) ↔ p≠±3`; `7/4 ↔ shart yo'q` | kvadratdan ikki taqiq chiqishini ko'rmaslik |
| 09 | H `ClozeBank` | 🔴 | `rule_words` | qoida: surat va maxrajni NOLGA TENG BO'LMAGAN bir xil ifodaga KO'PAYTIRSAK, qiymat o'zgarmaydi | bankda tuzoq: «qo'shsak», «ayirsak» |
| 10 | I `SwapOrder` | 🔴 | `order_steps` | `4/(n−6)` ni `n²−6n` maxrajiga keltirish: 4 satr, shart oxirida | shartni o'rtaga yoki boshiga qo'yish |

## 5. DARS 3 — KASRLARNI QISQARTIRISH

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `factor_seen` | 6 kasrdan 3 tasida umumiy ko'paytuvchi KO'RINIB turadi (ajratilgan holda) | `5q/(5+q)` — harflarni chizib tashlash |
| 02 | C `TrueFalse` | 🟢 | `cancel_claims` | `(c²−9)/(c+3) = c−3` — ha; `(c+5)/(c+7) = 5/7` — yo'q | qo'shiluvchini qisqartirish |
| 03 | E `TypeValue` | 🟢 | `hole_after_reduce` | `(d²−5d)/(d−5)` qisqargach `d` qoladi, lekin qaysi `d` da dastlabki kasr yo'q → **5** | «qisqardi, demak shart ham ketdi» |
| 04 | J `MatchPairs` | 🟡 | `reduce_to_what` | `6c/9c ↔ 2/3`; `(c+6)/(c+9) ↔ qisqarmaydi`; `c(c+6)/c(c+9) ↔ (c+6)/(c+9)`; `(c²−36)/(c+6) ↔ c−6` | ko'paytuvchi va qo'shiluvchini aralashtirish |
| 05 | B `Zones` | 🟡 | `does_it_cancel` | 8 karta, oldin KO'PAYTUVCHILARGA AJRATISH kerak: `q²−1`, `q²−4q+4`, `q²+3` … | `(q²+1)/(q+1)` — kvadratlar yig'indisi qisqarmaydi |
| 06 | I `SwapOrder` | 🟡 | `reduce_order` | `(2e+10)/(e²−25)`: yozuv → ajratish → qisqartirish → shart | shartni o'rtaga qo'yish |
| 07 | A `Choice` | 🟡 | `full_answer_choice` | `(3h+9)/(h²−9)` → `3/(h−3)`, shart `h ≠ ±3` | shartni JAVOBdan olish (`h ≠ 3` bilan cheklanish) |
| 08 | D `PairSlots` | 🔴 | `reduce_pairs` | `(r²−36)/(2r−12) ↔ (r+6)/2`; `(r²−36)/(r²+6r) ↔ (r−6)/r`; `(r²−36)/(6−r) ↔ −(r+6)` | ishora: `6−r = −(r−6)` |
| 09 | G `CodeLock` | 🔴 | `bans_survive` | `h(h+4)/(h(h−2)(h+4))` → kod **−4, 0, 2** | qisqargan ikkitasi ko'rinmaydi, lekin taqiq qoladi |
| 10 | H `ClozeBank` | 🔴 | `rule_words` | qoida: qisqartirish — umumiy KO'PAYTUVCHIGA bo'lish; QO'SHILUVCHI qisqarmaydi; shart DASTLABKI maxrajdan | bankda tuzoq: «qo'shiluvchi», «javobdan» |

## 6. DARS 4 — KASRLARNI QO'SHISH VA AYIRISH

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` | 🟢 | `same_denominator` | `5b/(b+7) + 2b/(b+7)` → `7b/(b+7)` | maxrajni ham qo'shish (`2b+14`) |
| 02 | F `MarkAll` | 🟢 | `add_marked_right` | 6 tenglikdan 3 tasi to'g'ri (maxrajlar bir xil holat) | `3/k + 4/k = 7/2k`, `= 8/k²` |
| 03 | C `TrueFalse` | 🟢 | `bans_from_both` | `3/(d−2) + 5/(d+6)`: `d = 2` da ma'noga ega emas — ha; `d = −6` da bor — yo'q | shartni faqat bitta maxrajdan olish |
| 04 | H `ClozeBank` | 🟡 | `rule_words` | qoida: maxrajlar bir xil bo'lsa faqat SURATLAR qo'shiladi; xil bo'lsa UMUMIY MAXRAJ topiladi; shart har bir DASTLABKI maxrajdan | bankda tuzoq: «maxrajlar», «javobdan» |
| 05 | G `CodeLock` | 🟡 | `bans_three_denoms` | `1/w + 2/(w−3) − 5/(w+5)` → kod **−5, 0, 3** | uchinchi maxrajni unutish |
| 06 | E `TypeValue` | 🟡 | `zero_but_banned` | `3/(u−4) − 3/(u−4)` hamma joyda nol, LEKIN bitta nuqtada yo'q → **4** | «nol — demak shartsiz» |
| 07 | B `Zones` | 🟡 | `add_correct_or_not` | 8 tenglik, maxrajlar XIL: `1/(k+1) + 1/(k−1) = 2k/(k²−1)` va h.k. | suratlarni ham «umumiylashtirish» |
| 08 | I `SwapOrder` | 🔴 | `common_denom_order` | `2/g + 3/(g+1)`: umumiy maxraj → keltirish → yig'indi → shart | shartni umumiy maxrajdan olish |
| 09 | J `MatchPairs` | 🔴 | `which_common_denom` | `1/t + 1/(t+3) ↔ t(t+3)`; `1/(t−3) + 1/(t+3) ↔ t²−9`; `1/t + 1/t² ↔ t²`; `1/2t + 1/3t ↔ 6t` | maxrajlarni doim ko'paytirish |
| 10 | D `PairSlots` | 🔴 | `extra_factor` | umumiy maxraj `f²−4`; qo'shimcha ko'paytuvchi: `3/(f−2)↔f+2`, `5/(f+2)↔f−2`, `7/(f²−4)↔1` | «har kasrga albatta qavs kerak» (yig'indi pazl kartasiga sig'madi — KONTENT_V2 §2.10) |

## 7. DARS 5 — KASRLARNI KO'PAYTIRISH VA BO'LISH

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `mul_div_claims` | `(2/g)·(3/g) = 6/g²` — ha; `(2/g):(3/g) = 6/g²` — yo'q | bo'lishda ag'darmaslik |
| 02 | B `Zones` | 🟢 | `mul_div_correct` | 8 tenglik: to'g'ri / noto'g'ri (`5/g : 5 = 25/g` ham bor) | songa bo'lishni ko'paytirish deb olish |
| 03 | F `MarkAll` | 🟢 | `flip_marked` | 6 yozuvdan 3 tasida bo'lish to'g'ri ko'paytirishga aylantirilgan | birinchi kasrni ag'darish |
| 04 | I `SwapOrder` | 🟡 | `divide_order` | `1/n : (n/4)`: yozuv → ag'darish → natija → shart | shartni boshiga qo'yish |
| 05 | A `Choice` | 🟡 | `third_condition` | `h/(h+1) : ((h−4)/(h+7))` — uchta shart, biri bo'luvchining SURATIDAN | `h ≠ 4` ni unutish |
| 06 | J `MatchPairs` | 🟡 | `mul_or_div_result` | `m/3 · 6/m ↔ 2`; `m/3 : 6/m ↔ m²/18`; `3/m · m/3 ↔ 1`; `3/m : m/3 ↔ 9/m²` | amal belgisiga qaramaslik |
| 07 | D `PairSlots` | 🟡 | `divisor_zero` | bo'luvchi qanday `f` da nolga aylanadi: `(f−4)/f↔4`, `(f+4)/f↔−4`, `f/(f−4)↔0` | ishora; «maxrajga qarash» (ikki kasrli yozuv pazl kartasiga sig'madi — KONTENT_V2 §2.07) |
| 08 | H `ClozeBank` | 🔴 | `rule_words` | qoida: bo'lish uchun IKKINCHI kasr AG'DARILADI; shart uch joydan — dastlabki MAXRAJ, bo'luvchining maxraji va bo'luvchining SURATI | bankda tuzoq: «birinchi», «javob» |
| 09 | E `TypeValue` | 🔴 | `lost_ban_division` | `(n+1)/n : ((n+1)/3)` javobida `n+1` qisqardi; javobda ko'rinmaydigan taqiq → **−1** | shartni javobdan yig'ish |
| 10 | G `CodeLock` | 🔴 | `three_bans` | `v/(v−2) : ((v+6)/(v−8))` → kod **−6, 2, 8** | `8` javobda ko'rinmaydi |

## 8. DARS 6 — IFODALARNI ALMASHTIRISH

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `first_action_mark` | 6 yozuvdan 3 tasida birinchi amal KO'PAYTIRISH | qavsni ko'rmaslik |
| 02 | A `Choice` | 🟢 | `which_first` | `1/c + 2/c · 3` — qaysi amal birinchi va natija | chapdan o'ngga hisoblash |
| 03 | C `TrueFalse` | 🟢 | `transform_claims` | `(1/b + 1/b)·b = 2` — ha; `1/b + 1/b·b = 2` — yo'q | qavssiz ham qavsdek hisoblash |
| 04 | D `PairSlots` | 🟡 | `hidden_ban_rows` | oraliq satr ↔ yashirin shart: `(d²−4)/(d−2)↔2`, `(d²−4)/(d+2)↔−2`, `(d²−4)/(4d)↔0` | ishora; suratga qarash (ikki kasrli yozuv kartaga sig'madi) |
| 05 | H `ClozeBank` | 🟡 | `rule_words` | qoida: avval QAVS, keyin KO'PAYTIRISH va bo'lish, oxirida qo'shish; shart ORALIQ satrlardan ham | bankda tuzoq: «chapdan o'ngga», «javobdan» |
| 06 | B `Zones` | 🟡 | `transform_correct` | 8 almashtirish: to'g'ri / noto'g'ri (`(b+3)/(b+5) = 3/5` ham bor) | harflarni qisqartirish |
| 07 | J `MatchPairs` | 🟡 | `first_action` | to'rt yozuv ↔ ko'paytirish / qavsdagi qo'shish / bo'lish / qavsdagi ayirish | qavs va amal tartibi |
| 08 | G `CodeLock` | 🔴 | `hidden_conditions` | `1/p + 1/(p−5) : (2/(p+1))` → kod **−1, 0, 5** | `−1` javobda ko'rinmaydi |
| 09 | I `SwapOrder` | 🔴 | `order_of_actions` | `(1/u − 1/(u+3)) · (u(u+3)/3)`: qavs → ko'paytirish → javob (`1`) → shart | javobni oldinga, shartni o'rtaga qo'yish |
| 10 | E `TypeValue` | 🔴 | `full_transform` | `(1/u − 1/(u+3))·(u(u+3)/3)` → **1**: javob SON, lekin shartlar qoladi | qavs nolga teng deb o'ylash; «javob son — demak shart yo'q» |

---

## 9. UMUMIY QOIDALAR (hamma besh darsga)

1. **Harf har topshiriqda boshqacha** — hozirgi darslarda shunday, saqlanadi.
2. **Sonli misol dars ichida takrorlanmaydi** (TIPLAR §7 p. 6).
3. **Uch til**: UZ (`siz`, ASCII `'`), RU (`ты`), EN. UZ satrida kirill yo'q.
4. **Razbor har xato variantga alohida**, javobni aytmaydi — belgiga ishora qiladi.
5. **`kit.jsx` ga yangi tip qo'shilmaydi.** O'nta tip bor, hammasi ishlaydi. Faqat
   ma'lumot fayllari (`D0N_MM.jsx`) qayta yoziladi.
6. **Dizayn tegilmaydi**: fon, ranglar, `S`/`C`/`HFB`/`Head`, chip qatori — o'sha.
7. **Tekshiruv skriptlari yangilanadi**: `grade8-practice-plan.mjs` da 2-6 darslar uchun
   `ok` va `no` qadamlari yangi mexanikalarga moslanadi (`slot`, `pair`, `tap`, `fill`),
   keyin `grade8-practice-check.mjs` ikki yo'lda ham toza bo'lishi kerak.

---

## 10. NIMA TASDIQ KUTADI

1. **Ketma-ketliklar jadvali** (§2) — shundaymi yoki boshqa tartib kerakmi.
2. **`TypeExpr` yo'qolishi** (§3) — qabul qilinadimi yoki o'nlikka kiritilsinmi.
3. **Har darsdagi mazmun mosligi** (§4-8) — qaysi topshiriq qaysi shaklga o'tgani.

**2-6 DARSLAR BAJARILDI** (2026-08-24): har biriga `DARS0N_AMALIYOT_KONTENT_V2.md`,
hammasi yig'ildi va tekshiruvdan o'tdi (`npm run build` o'tadi, to'g'ri va noto'g'ri
yo'l 5 o'lcham x 3 tilda toza). Uchta joyda skeletdan ataylab chetlanildi — pazl
kartasi telefonda 54px va unga ikki kasrli yozuv sig'maydi; har biri o'z KONTENT_V2
faylida yozilgan (4-dars §2.10, 5-dars §2.07, 6-dars §2.04).

Tasdiqdan keyin 2-etap: har dars uchun to'liq kontent (UZ/RU/EN + razborlar), keyin
sborka va QA — darsma-dars, 2-darsdan boshlab.
