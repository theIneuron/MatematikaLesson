# KEEP-VISIBLE STANDART AUDITI — Dars01–27

> Standart manbasi: `PROMPT_YANGI_DARS.md` §2-B (keep-visible rebuild) + §2-C (Dars28 to'liq reestr).
> Etalon fayllar: **Dars28.jsx** (dec_5_05, 2-C) va **Dars37.jsx** (geom, 2-B keep-visible).
> Audit sanasi: 2026-06-20. Tekshirilgan: Dars01–27 (27 dars). Hech bir fayl o'zgartirilmadi.
> Dars28–37 = reference to'plam (allaqachon standartda), bu auditga kirmaydi.

## 10 mezon (har biri tekshirildi)

1. **Keep-visible MC** — to'g'ri javobdan keyin sarlavha+savol+to'g'ri variant QOLADI, faqat noto'g'rilari yig'iladi (`gridTemplateColumns: solved`). Eski varianti = collapse-on-correct (`maxHeight: solved ? 0` butun savolni yig'adi). Yoki umuman yo'q (plain QuestionScreen v1/v2).
2. **Top-align** — kontent wrapperda `justifyContent:'center'` / matnda `textAlign:'center'` YO'Q (faqat figura ramkasi gorizontal markazlashi mumkin).
3. **Ortiqcha scroll** — `scrollIntoView` soni. 1 = standart FeedbackBlock (OK). 2+ = ortiqcha step-scroll (buzilish).
4. **Javob sirqishi** — `wrong_N`/`hint`/`on_wrong` da yakuniy son BO'LMAYDI (faqat metod).
5. **frame-tip** — pale-yellow ogohlantirish/kalit-g'oya kartasi.
6. **shuffleMC + wrong_N** — har MC testda majburiy.
7. **Ovoz tozaligi** — ovozlanadigan hint/wrong_N da `× ÷ = % < > / + −`, «», uzun tire YO'Q.
8. **Qattiq idx** — `idx={N}` / `SCREEN_META[N]` literal raqam (buzilish) emas, `idx={screen}`.
9. **s0 animatsiya** — birinchi ekranda harakatlanuvchi animatsiya.
10. **h-title** — yangi standart: katta in-content sarlavha YO'Q (kontent darhol boshlanadi).

## Konsolidatsiya jadvali

| Dars | Mavzu | KeepVisible | TopAlign-buz. | Scroll | Javob sirqishi | frame-tip | shuffleMC | Ovoz | Qattiq idx | s0 anim | h-title |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | Katta sonlar (nat) | **yo'q** (v1 + eski collapse) | 15 | 2⚠ | yo'q | ✓ | yo'q | iflos | bor | qisman | har slayd |
| 02 | Taqqoslash/yaxlitlash (nat) | **yo'q** (v1) | 12 | 2⚠ | yo'q | ✓ | yo'q | iflos | bor | yo'q⚠ | har slayd |
| 03 | Ustun qo'shish/ayirish (nat) | **yo'q** (v1) | 31 | 2⚠ | **HA**⚠ | ✓ | yo'q | iflos⚠ | bor | yo'q⚠ | har slayd |
| 04 | Ustun ko'paytirish (nat) | **yo'q** (v1) | 14 | 1 | qisman | ✓ | yo'q | iflos | bor | yo'q | qisman |
| 05 | Burchakli bo'lish (nat) — **PILOT** | **yo'q** (v1) | 8 | 2⚠ | **HA**⚠ | ✓ | yo'q | iflos⚠ | bor | yo'q | qisman |
| 06 | Manfiy sonlar koord. o'qida | **yo'q** | 28 | 1 | yo'q | ✓ | ✓ | toza | bor | bor (sayohatchi⚠) | har slayd |
| 07 | Butun sonlar taqqoslash | **yo'q** | 30 | 1 | yo'q | ✓ | ✓ | toza | bor | yo'q | har slayd |
| 08 | Daraja, kvadrat/kub | **yo'q** | 13 | 1 | yo'q | ✓ | ✓ | iflos | bor | yo'q | har slayd |
| 09 | Kasr — butun qismi | **yo'q** | 7 | 1 | yo'q | ✓ | **qisman** (shuffleMC yo'q) | toza | bor | bor | har slayd |
| 10 | Kasr son o'qida | **yo'q** | 7 | 1 | yo'q | ✓ | qisman (hint_N nomi) | toza | bor | bor (sayohatchi⚠) | har slayd |
| 11 | Kasr — bo'lish natijasi | **yo'q** (v2) | 11 | 1 | qisman | ✓ | ✓ | iflos | bor | bor | har slayd |
| 12 | Taqqoslash, bir xil maxraj | **yo'q** (v2) | 11 | 1 | qisman | ✓ | ✓ | iflos | bor | bor | har slayd |
| 13 | Taqqoslash, bir xil surat | **yo'q** (v2) | 16 | 1 | qisman | ✓ | ✓ | iflos | bor | bor | har slayd |
| 14 | Taqqoslash, har xil maxraj | **yo'q** (v2) | 8 | 1 | qisman | ✓ | ✓ | iflos⚠ | bor | bor | har slayd |
| 15 | Ekvivalent kasrlar (eski etalon) | **yo'q** (v2) | 12 | 1 | qisman | ✓ | ✓ | iflos | bor | bor | har slayd |
| 16 | Kasrlarni qisqartirish | **yo'q** (v1) | 6 | 1 | **HA**⚠ | ✓ | ✓ | iflos | bor | bor | har slayd |
| 17 | Qo'shish, teng maxraj | **yo'q** (v2) | 10 | 1 | **HA**⚠ | ✓ | ✓ | iflos | bor | bor | har slayd |
| 18 | Ayirish, teng maxraj | **yo'q** (v2) | 8 | 1 | **HA**⚠ | ✓ | ✓ | iflos⚠ | bor | bor | har slayd |
| 19 | Qo'shish, har xil maxraj | **yo'q** (v2) | 9 | 1 | **HA**⚠ | ✓ | ✓ | iflos | bor | bor | **yo'q** (h-sub) |
| 20 | Ayirish, har xil maxraj | **YANGI** ✓ | **0** | 1 | qisman | ✓ | ✓ | deyarli toza | bor | bor | qisman |
| 21 | To'g'ri/noto'g'ri/aralash | **yo'q** (v1) | 8 | **3**⚠ | **HA**⚠ | ✓ | ✓ | iflos | bor | yo'q/zaif⚠ | har slayd |
| 22 | Aralash↔noto'g'ri kasr | **yo'q** (v1) | **52**⚠ | 1 | **HA**⚠ | ✓ | ✓ | iflos | bor | bor | har slayd |
| 23 | Aralash sonlar qo'shish/ayirish | **yo'q** (v1) | 37 | **2**⚠ | **HA**⚠ | ✓ | ✓ | iflos | bor | bor | har slayd |
| 24 | O'nli kasr — konsept | **yo'q** (v1) | 39 | 1 | **HA**⚠ | ✓ | ✓ | iflos⚠ | bor | bor | har slayd |
| 25 | O'nli taqqoslash/yaxlitlash | **ARALASH** (option keep-visible + savol eski-collapse @785⚠) | 34 | 1 | **HA** | ✓ | ✓ | iflos | bor | bor | har slayd |
| 26 | O'nli qo'shish/ayirish | **yo'q** (v1) | 36 | **2**⚠ | **HA**⚠ | ✓ | ✓ | iflos | bor | bor | har slayd |
| 27 | O'nlini 10/100/1000 ga ko'p./bo'l. | **yo'q** (v1) | 46 | **2**⚠ | **HA**⚠ | ✓ | ✓ | iflos⚠ | bor | bor | har slayd |

## Asosiy xulosalar

**Hech bir dars (01–27) keep-visible standartiga to'liq mos kelmaydi.** Eng yaqinlari:
- **Dars20** (frac_5_12) — keep-visible MC bor, top-align 0, ovoz deyarli toza. Faqat qattiq `idx` + ba'zi vizual hintda belgi + ba'zi katta h-title qoldi. **Eng oson** standartga keltirish.
- **Dars25** (dec_5_02) — gibrid: MC variantlari keep-visible, LEKIN savolni hali ham eski usulda yig'adi (`maxHeight: solved ? 0` @785). Faqat shu collapse'ni olib tashlash + idx kerak.

**Qolgan 25 dars — pre-standart.** Hammasida bir xil 4 ta bloklovchi farq:
1. **Keep-visible MC yo'q** — plain QuestionScreen v1/v2 (eng katta ish; Dars28/37 infra'sini ko'chirish).
2. **Top-align buzilishi** — `justifyContent/textAlign: center` (eng og'iri: Dars22=52, Dars27=46, Dars24=39, Dars23/26/25=34–37).
3. **Har slaydda katta h-title** (standart: yo'q; faqat Dars19 va Dars20 toza).
4. **Qattiq `idx={N}`** — hammada.

**Hammada allaqachon TOZA:** frame-tip, shuffleMC (Dars09/10 dan tashqari), 1 ta standart scrollIntoView (ko'pchilikda).

## Ustuvorlik (eng yomonidan)

**P0 — javob sirqishi + iflos ovoz (eng zararli, bola javobni eshitib oladi):**
Dars03, Dars05, Dars24, Dars27, Dars22, Dars23, Dars26 — ovozlanadigan hintda yakuniy son va `× = / < >` belgilar. Bular ishonchni ham buzadi, TTS ham buzadi.

**P1 — ortiqcha scroll (no-scroll buzilishi):**
Dars01, 02, 03, 05, 21, 23, 26, 27 — 2–3 ta scrollIntoView (step-scroll olib tashlanadi).

**P2 — eng og'ir layout (markazlash):**
Dars22, 27, 24, 25, 26, 23, 07, 06.

**P3 — qisman/oson:**
Dars20 (deyarli tayyor), Dars25 (gibrid), Dars09/10 (shuffleMC qo'shish).

## Avlodlar (bir xil infra = deyarli mexanik batch)

- **eski-Nat (Dars01–05):** v1 QS, shuffleMC YO'Q, ovoz eng iflos (03/05 javob sirqadi). Pilot = **Dars05**.
- **manfiy/daraja (Dars06–08):** v1/v2, layout og'ir.
- **eski-frac (Dars09–18):** v1/v2, bir xil infra — bitta retsept hammasiga.
- **o'tish (Dars19–21):** Dars19 h-title toza, Dars20 deyarli tayyor, Dars21 scroll+s0 muammoli.
- **aralash/o'nli (Dars22–27):** v1, layout eng og'ir, ovoz iflos, ba'zi scroll.

## PILOT: Dars05 (burchakli bo'lish, nat_5_05)
Metodist tanladi. Bloklovchi ishlar: (1) v1 MC → keep-visible (titleNode+question); (2) shuffleMC qo'shish + wrong_N keying; (3) ovozlanadigan hintdan yakuniy son va `< — ÷` belgilarni olib tashlash (metod-only); (4) ortiqcha scrollIntoView olib tashlash; (5) top-align (8 ta) → top-anchor; (6) s0 ga harakatlanuvchi animatsiya; (7) qattiq idx → `idx={screen}`. Top-align eng yengili (8), lekin ovoz tozaligi P0.
