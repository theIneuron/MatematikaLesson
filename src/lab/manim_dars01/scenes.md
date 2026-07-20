# Dars01 — "O'nliklar va birliklar" (Manim klip rejasi)

> `manim-composer` skili uslubida. Bu — klip **rejasi**; kod: `onlik_birlik.py`.
> Bu Manim eksperimenti: interaktiv React darsni EMAS, balki qisqa tushuntirish
> klipini beradi (dars ichiga qo'yish mumkin bo'lgan asset).

## Overview
- **Topic**: 100 gacha razryad — o'nlik va birlik
- **Hook**: Sonda nechta o'nlik, nechta birlik? Buni ko'rib bo'ladimi?
- **Target Audience**: 2-sinf (1-sinf sanashni biladi)
- **Estimated Length**: ~50 s
- **Key Insight**: raqamning O'RNI uning qiymatini belgilaydi (chap=o'nlik, o'ng=birlik)

## Narrative Arc
Alohida birliklardan boshlaymiz → o'ntasi bitta o'nlikka birlashadi (unitizing) →
undan 34 sonini yig'amiz → 34 = 30 + 4 rang-kodli ochiladi → qoida (o'rin hal qiladi)
→ son o'qida katta sakrash/kichik qadam bilan mustahkamlanadi.

---

## Scene 1: Sarlavha (~4s)
Qora fon, "O'nliklar va birliklar", to'q sariq izohsatr. Write + FadeIn.

## Scene 2: Unitizing (~10s)
10 ta ko'k birlik-kvadrat bittalab paydo bo'ladi → vertikal ustunga yig'ilib
to'q sariq "o'nlik tayoqchasi" ga aylanadi (Transform). Yozuv: "10 birlik = 1 o'nlik".

## Scene 3: 34 ni yig'ish (~12s)
3 o'nlik tayoqchasi (GrowFromCenter, LaggedStart) + 4 ko'k birlik. Katta "34"
paydo bo'ladi, 3 to'q sariq / 4 ko'k rang-kodli. Ostida: 34 = 30 + 4.

## Scene 4: Qoida (~8s)
"34" tepaga chiqadi; 3 ostiga to'q sariq strelka "o'nliklar", 4 ostiga ko'k
"birliklar". Yozuv: "Chap raqam — o'nliklar, o'ng — birliklar".

## Scene 5: Son o'qi (~12s)
0..40 son o'qi. Marker 0 dan 3 marta katta sakrash (+10) bilan 30 ga (Flash),
so'ng 4 kichik qadam bilan 34 ga. 34 markeri.

## Scene 6: Yakun (~4s)
"10 birlik = 1 o'nlik" · "Chap — o'nliklar · O'ng — birliklar".

## Color Palette
- O'nlik / aksent: #fe5b1a
- Birlik: #4a86ff
- Matn: #F6F4EF
- Fon: #0a0e1a

## Implementation Order
1 → 2 → 3 → 4 → 5 → 6 (ketma-ket, bir Scene ichida). LaTeX ishlatilmaydi (Text/Pango).

## Cheklov (metodik)
Bu klip PASSIV — bola bosmaydi, javob bermaydi. `teaching_methodology` "bola qiladi"
talab qiladi. Shuning uchun bu — interaktiv darsni EMAS, balki uning ICHIGA
qo'yiladigan qisqa tushuntirish-klip (masalan hook yoki qoida momentida).
