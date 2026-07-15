# Dars02 «Ikki xonali sonni o'qish va yozish» — CONTENT (RU + UZ + audio)

> Pipeline [2] content. Etalon: `ETALON_2SINF.md` §11 (jonli Dars01 kod). Syujet: «Yulduz porti»,
> boshqaruv minorasi, faqat Bit (ayol ovoz). Rang-kod: o'nlik `#FF4F28` / birlik `#019ACB`.
> Audio TTS-toza (sonlar so'z bilan, belgi/«»/ikki-nuqta-ro'yxat yo'q, bir segment = bir fikr;
> xato-hint metodni ko'rsatadi, yakuniy sonni bermaydi). Register: RU `ты` (jinssiz — erkak/ayol
> o'tgan zamon fe'l YO'Q), UZ `siz`, SOV, oddiy `'`. UZ — toza lotin.
>
> UZ son-nomlari (draft, o'zbek metodist tasdig'i): o'n, yigirma, o'ttiz, qirq, ellik, oltmish,
> yetmish, sakson, to'qson; o'n bir…o'n to'qqiz. RU: десять…девяносто; одиннадцать…девятнадцать.
>
> Struktura (§11.6): 1 hook+mavzu · 2–6 tushuntirish (s5 akkordeon) · 7 qoida | 8–13 mashq (s1
> recall shu yerda) | 14 final | 15 summary. Reversal (47/74) va nol-belgisi (60) — matematik
> qoidalar (§11.5).

---

## s0 — HOOK + MAVZU (scope: hook)
**Vizual:** topic-chip «Тема: Чтение и запись чисел» / "Mavzu: Sonlarni o'qish va yozish".
lead: RU «Коды бортов перепутались!» / UZ "Bort kodlari chalkashib ketdi!"
savol: RU «Как правильно прочитать код?» / UZ "Kodni qanday to'g'ri o'qiymiz?"
- opt0: RU «Читать цифры подряд» / UZ "Raqamlarni ketma-ket o'qiymiz"
- opt1 (yetakchi): RU «По разрядам: десятки, потом единицы» / UZ "Xonalar bo'yicha: o'nliklar, keyin birliklar"
- opt2: RU «Не знаю» / UZ "Bilmayman"

**Audio.intro (mavzu + missiya, ketma-ket):**
1. RU «Сегодня тема урока: чтение и запись чисел. Научимся правильно читать и писать бортовые коды.» / UZ "Bugungi dars mavzusi: sonlarni o'qish va yozish. Bort kodlarini to'g'ri o'qish va yozishni o'rganamiz."
2. RU «Бит на командной вышке. Коды кораблей на табло перепутались — их надо прочитать и записать верно.» / UZ "Bit boshqaruv minorasida. Displeydagi kema kodlari chalkashib ketgan — ularni to'g'ri o'qib va yozib chiqamiz."
3. RU «Иначе корабли не найдут свой отсек. Давай наведём порядок.» / UZ "Aks holda kemalar o'z bo'limini topolmaydi. Keling, tartib o'rnatamiz."

**on_correct (opt1):** RU «Верно! Слева читаем десятки, справа единицы.» / UZ "To'g'ri! Chapdan o'nliklarni, o'ngdan birliklarni o'qiymiz."
**on_wrong (opt0):** RU «Так можно ошибиться. Код читают не по цифрам, а по разрядам.» / UZ "Bunday adashish mumkin. Kod raqamlab emas, xonalab o'qiladi."
**on_unknown (opt2):** RU «Ничего. Сейчас научимся.» / UZ "Hechqisi yo'q. Hozir o'rganamiz."

---

## s2 — OCHILISH-1 · O'QISH: kod → nom (scope: null)
**Mexanika:** kod `45` ko'rsatiladi (rang-kod). Bosib qismlarga ochiladi: chap `4`→«сорок/qirq» (o'nlik), o'ng `5`→«пять/besh» (birlik) → butun «сорок пять / qirq besh». Ovoz↔vizual sinxron.
lead: RU «Читаем код 45» / UZ "45 kodini o'qiymiz"
**Audio (qadamlar):**
1. RU «Левая цифра — десятки. Четыре десятка читаем словом сорок.» / UZ "Chap raqam — o'nliklar. To'rt o'nlikni qirq deb o'qiymiz."
2. RU «Правая цифра — единицы. Пять единиц читаем словом пять.» / UZ "O'ng raqam — birliklar. Besh birlikni besh deb o'qiymiz."
3. RU «Вместе, слева направо: сорок пять. Так и читается код.» / UZ "Birga, chapdan o'ngga: qirq besh. Kod shunday o'qiladi."

---

## s3 — OCHILISH-2 · YOZISH: nom → kod (scope: null)
**Mexanika:** Bit nomni aytadi «пятьдесят три / ellik uch» → bola digit-plita bilan slotlarga yozadi (o'nlik slot chapda, birlik o'ngda). Веди-до-верного; xato o'rin → hint.
lead: RU «Запиши код: пятьдесят три» / UZ "Kodni yozing: ellik uch"
**Audio (qadamlar):**
1. RU «Слушай имя: пятьдесят три. Пятьдесят — это десятки, ставим слева.» / UZ "Nomni tinglang: ellik uch. Ellik — o'nliklar, chapga qo'yamiz."
2. RU «Три — это единицы, ставим справа.» / UZ "Uch — birliklar, o'ngga qo'yamiz."
3. RU «Получился код пятьдесят три. Сначала десятки, потом единицы.» / UZ "Ellik uch kodi chiqdi. Avval o'nliklar, keyin birliklar."
**on_wrong (metod):** RU «Проверь место: имя десятков — слева.» / UZ "O'rinni tekshiring: o'nlik nomi — chapda."

---

## s4 — OCHILISH-3 · YUMALOQ SON va NOL (scope: null) [matematik qoida: nol-belgisi]
**Mexanika:** `40`→«сорок/qirq» (birlik xonasida 0, nom aytilmaydi); `11`→«одиннадцать / o'n bir». Mat ko'rsatadi: birlik = 0.
lead: RU «Круглый код: 40» / UZ "Yumaloq kod: 40"
**Audio (qadamlar):**
1. RU «Сорок — это четыре десятка и ноль единиц. Имя единиц не звучит.» / UZ "Qirq — to'rt o'nlik va nol birlik. Birlik nomi aytilmaydi."
2. RU «Но ноль пишется: он держит место единиц. Без нуля осталась бы просто четвёрка.» / UZ "Lekin nol yoziladi: u birliklar o'rnini band qiladi. Nol bo'lmasa, faqat to'rt qolardi."
3. RU «А число одиннадцать читаем целиком: одиннадцать. Это один десяток и одна единица.» / UZ "O'n bir sonini esa yaxlit o'qiymiz: o'n bir. Bu bitta o'nlik va bitta birlik."

---

## s5 — FLAGMAN AKKORDEON · «O'qiymiz va yozamiz» kod 47 (scope: null; progressive disclosure)
**Mexanika:** akkordeon-stepper (§11.1). Qadamlar fokusда, tugagani tepага ✓-chip. Mat+rang-kod, sinxron.
eyebrow: RU «Разбор кода» / UZ "Kodni ochamiz". next: RU «Дальше» / UZ "Keyingi".
**Qadamlar (title / chip):**
1. RU «В коде два разряда» / «2 разряда» — UZ "Kodda ikki xona" / "2 xona"
2. RU «Слева — десятки: сорок» / «Десятки → сорок» — UZ "Chapda — o'nliklar: qirq" / "O'nlik → qirq"
3. RU «Справа — единицы: семь» / «Единицы → семь» — UZ "O'ngda — birliklar: yetti" / "Birlik → yetti"
4. RU «Читаем: сорок семь» / «Читаем: 47» — UZ "O'qiymiz: qirq yetti" / "O'qiymiz: 47"
5. RU «Пишем по имени обратно» / «Имя → 47» — UZ "Nomdan qaytadan yozamiz" / "Nom → 47"

**Audio (qadam-segmentlar):**
1. RU «Разберём код сорок семь. В нём два разряда: десятки и единицы.» / UZ "Qirq yetti kodini ochamiz. Unda ikki xona bor: o'nliklar va birliklar."
2. RU «Левый разряд — десятки. Четыре десятка читаем словом сорок.» / UZ "Chap xona — o'nliklar. To'rt o'nlikni qirq deb o'qiymiz."
3. RU «Правый разряд — единицы. Семь единиц — это семь.» / UZ "O'ng xona — birliklar. Yetti birlik — bu yetti."
4. RU «Читаем слева направо: сорок семь. Имя десятков, потом имя единиц.» / UZ "Chapdan o'ngga o'qiymiz: qirq yetti. O'nlik nomi, keyin birlik nomi."
5. RU «А если слышим имя сорок семь — пишем обратно: сорок в разряд десятков, семь в разряд единиц.» / UZ "Agar qirq yetti nomini eshitsak — qaytadan yozamiz: qirqni o'nliklar xonasiga, yettini birliklar xonasiga."

---

## s6 — OCHILISH-4 · REVERSAL 47 va 74 (scope: null; matematik qoida: o'rin) [digit-plita]
**Mexanika:** Dars01 s6 kabi — bola nomdan kodni teradi, lyuk ochiladi. 1-lyuk «сорок семь»→47; 2-lyuk «семьдесят четыре»→74. Bir xil raqam, boshqa o'rin → boshqa nom va son.
lead: RU «Одни цифры — а имена разные.» / UZ "Bir xil raqamlar — lekin nomlar har xil."
tens_label/ones_label: RU «десятки»/«единицы» · UZ "o'nliklar"/"birliklar".
round1: RU «Код: сорок семь» / UZ "Kod: qirq yetti". round2: RU «Код: семьдесят четыре» / UZ "Kod: yetmish to'rt".
wrong: RU «Имя десятков ставим слева. Попробуй ещё.» / UZ "O'nlik nomini chapga qo'ying. Yana urinib ko'ring."
done_text: RU «Место цифры меняет и имя, и число.» / UZ "Raqamning o'rni nomni ham, sonni ham o'zgartiradi."
**Audio:**
1. RU «Собери код по имени сорок семь. Десятки слева, единицы справа. Люк открылся!» / UZ "Qirq yetti nomi bo'yicha kodni tering. O'nliklar chapda, birliklar o'ngda. Lyuk ochildi!"
2. RU «Теперь имя семьдесят четыре. Те же цифры, но места поменялись.» / UZ "Endi yetmish to'rt nomi. O'sha raqamlar, lekin o'rni almashdi."
3. RU «Сорок семь и семьдесят четыре — разные числа. Место цифры решает.» / UZ "Qirq yetti va yetmish to'rt — boshqa sonlar. Raqamning o'rni hal qiladi."

---

## s7 — QOIDA (scope: null; karta-aksent + faol check)
rule: RU «Читаем слева направо: имя десятков, затем имя единиц. Пишем: десяток — слева, единицу — справа.» / UZ "Chapdan o'ngga o'qiymiz: o'nliklar nomi, keyin birliklar nomi. Yozganda: o'nlik — chapga, birlik — o'ngga."
check_q: RU «Нажми цифру десятков.» / UZ "O'nliklar raqamini bosing." (yangi son 72)
check_ok: RU «Верно! Слева — десятки.» / UZ "To'g'ri! Chapda — o'nliklar."
check_no: RU «Десятки стоят слева. Нажми левую цифру.» / UZ "O'nliklar chapda turadi. Chap raqamni bosing."
**Audio (5 segment, ustoz-tushuntirish + aksent):**
1. RU «Запомним главное правило чтения и записи. Слушай внимательно.» / UZ "O'qish va yozishning asosiy qoidasini yodda tutamiz. Diqqat bilan tinglang."
2. RU «Как понять, где десятки, а где единицы? Только по месту.» / UZ "Qaysi biri o'nlik, qaysi birlik — buni faqat o'rniga qarab bilamiz."
3. RU «Левая цифра — всегда десятки, её имя звучит первым.» / UZ "Chap raqam — har doim o'nliklar, uning nomi birinchi aytiladi."
4. RU «Вот правило: читаем слева направо, пишем десяток слева, единицу справа.» / UZ "Mana qoida: chapdan o'ngga o'qiymiz, o'nlikni chapga, birlikni o'ngga yozamiz."
5. RU «А теперь сам. Нажми цифру, которая показывает десятки.» / UZ "Endi o'zingiz. O'nliklarni ko'rsatadigan raqamni bosing."

---

## s8 — MASHQ-1 · O'QISH MC (scope: practice)
q: RU «Как читается код 63?» / UZ "63 kodi qanday o'qiladi?" · kod 63 rang-kodli.
Variantlar: **«шестьдесят три / oltmish uch» (correct)** · «тридцать шесть / o'ttiz olti» · «шесть три / olti uch» · «шестьсот три / olti yuz uch»
wrong (36): RU «Переставил разряды. Слева шесть — это десятки.» / UZ "Xonalarni almashtirdingiz. Chapda olti — o'nliklar."
wrong (6 3): RU «Читаем не по цифрам, а по разрядам: имя десятков и имя единиц.» / UZ "Raqamlab emas, xonalab o'qiymiz: o'nlik nomi va birlik nomi."
wrong (603): RU «Слишком большое. Здесь только десятки и единицы.» / UZ "Juda katta. Bu yerda faqat o'nlik va birlik."
on_correct: RU «Верно. Шесть десятков и три единицы — шестьдесят три.» / UZ "To'g'ri. Olti o'nlik va uch birlik — oltmish uch."
audio.intro: RU «Прочитай код на табло. Выбери правильное имя.» / UZ "Displeydagi kodni o'qing. To'g'ri nomni tanlang."

---

## s9 — MASHQ-2 · JUFTLASH (scope: practice)
q: RU «Соедини код с его именем.» / UZ "Kodni nomi bilan ulang."
Juftlar: `52`↔«пятьдесят два / ellik ikki» · `25`↔«двадцать пять / yigirma besh» · `70`↔«семьдесят / yetmish»
wrong (52↔yigirma besh): RU «Место решает: пять слева — это десятки.» / UZ "O'rin hal qiladi: besh chapda — o'nliklar."
wrong (70↔yetti): RU «Ноль держит разряд единиц: это семьдесят.» / UZ "Nol birliklar xonasini band qiladi: bu yetmish."
on_correct: RU «Верно. Каждый код нашёл своё имя.» / UZ "To'g'ri. Har kod o'z nomini topdi."
audio.intro: RU «Соедини каждый код с его именем.» / UZ "Har kodni o'z nomi bilan ulang."

---

## s10 — MASHQ-3 · DIAGNOSTIKA ketma-ket, kod 58 (scope: practice)
done_text: RU «Диагностика пройдена! Пять десятков и восемь единиц — пятьдесят восемь.» / UZ "Diagnostika o'tdi! Besh o'nlik va sakkiz birlik — ellik sakkiz."
audio.intro: RU «Бортовая диагностика. Ответь на три вопроса.» / UZ "Bort diagnostikasi. Uch savolga javob bering."
- **Sub-1:** RU «Сколько десятков?» / UZ "Nechta o'nlik?" — variantlar 5 / 8 / 58 · **to'g'ri 5**
  no: RU «Десятки — левая цифра. Восемь стоит справа.» / UZ "O'nliklar — chap raqam. Sakkiz o'ngda turadi."
- **Sub-2:** RU «Сколько единиц?» / UZ "Nechta birlik?" — variantlar 8 / 5 / 13 · **to'g'ri 8**
  no: RU «Единицы — правая цифра.» / UZ "Birliklar — o'ng raqam."
- **Sub-3:** RU «Как называется число?» / UZ "Bu son qanday nomlanadi?" — «пятьдесят восемь / ellik sakkiz» / «восемьдесят пять / sakson besh» / «пять восемь / besh sakkiz» · **to'g'ri: ellik sakkiz**
  no (reversal): RU «Слева пять — десятки: пятьдесят восемь, не наоборот.» / UZ "Chapda besh — o'nliklar: ellik sakkiz, teskarisi emas."

---

## s11 — MASHQ-4 · YOZISH nomdan (scope: practice) [digit-plita]
q: RU «Запиши код: семьдесят два» / UZ "Kodni yozing: yetmish ikki" · to'g'ri 72.
wrong (27): RU «Семьдесят — это десятки, ставь слева.» / UZ "Yetmish — o'nliklar, chapga qo'ying."
wrong (702): RU «Только два места: десятки и единицы.» / UZ "Faqat ikki o'rin: o'nlik va birlik."
on_correct: RU «Верно. Семь десятков и две единицы — семьдесят два.» / UZ "To'g'ri. Yetti o'nlik va ikki birlik — yetmish ikki."
audio.intro: RU «Запиши код по имени семьдесят два. Сначала десятки, потом единицы.» / UZ "Yetmish ikki nomi bo'yicha kodni yozing. Avval o'nliklar, keyin birliklar."

---

## s12 — MASHQ-5 · BORT TESTI 3-sub (scope: practice)
done_text: RU «Тест пройден! Ты читаешь и пишешь любой код.» / UZ "Test o'tdi! Har kodni o'qiysiz va yozasiz."
audio.intro: RU «Бортовой тест. Три задания.» / UZ "Bort testi. Uchta topshiriq."
- **Sub-1 (o'qish MC):** kod `36` → nom. To'g'ri «тридцать шесть / o'ttiz olti». wrong (oltmish uch): «Слева три — десятки: тридцать шесть.» / "Chapda uch — o'nliklar: o'ttiz olti."
- **Sub-2 (yozish, plita):** nom «восемьдесят один / sakson bir» → 81. wrong (18): «Восемьдесят — десятки, слева.» / "Sakson — o'nliklar, chapda."
- **Sub-3 (yumaloq/nol):** RU «Как читается 60?» / UZ "60 qanday o'qiladi?" — «шестьдесят / oltmish» (correct) · «шесть / olti» · «шестьсот / olti yuz».
  wrong (olti): RU «Ноль держит единицы: шестьдесят, не шесть.» / UZ "Nol birliklarni band qiladi: oltmish, olti emas."

---

## s13 — MASHQ-6 · HAYOTIY MASALA (scope: practice)
Vizual: yuk xati (6 kasseta + 3 batareya). q: RU «В накладной: шесть десятков и три единицы. Запиши бортовой код.» / UZ "Yuk xatida: olti o'nlik va uch birlik. Bort kodini yozing." · to'g'ri 63.
Variantlar: 63 (correct) · 36 · 9 · 630
wrong (36): RU «Десятков шесть — они слева.» / UZ "O'nlik oltita — ular chapda."
wrong (9): RU «Не складываем: десятки и единицы пишем рядом.» / UZ "Qo'shmaymiz: o'nlik va birlikni yonma-yon yozamiz."
wrong (630): RU «Только два разряда.» / UZ "Faqat ikki xona."
on_correct: RU «Верно. Шесть десятков и три единицы — шестьдесят три.» / UZ "To'g'ri. Olti o'nlik va uch birlik — oltmish uch."
audio.intro: RU «По накладной запиши бортовой код. Десятки слева, единицы справа.» / UZ "Yuk xati bo'yicha bort kodini yozing. O'nliklar chapda, birliklar o'ngda."

---

## s14 — FINAL (scope: final; factOnCorrect)
q: RU «Как читается код 84?» / UZ "84 kodi qanday o'qiladi?"
Variantlar: **«восемьдесят четыре / sakson to'rt» (correct)** · «сорок восемь / qirq sakkiz» · «восемь четыре / sakkiz to'rt» · «восемьсот четыре / sakkiz yuz to'rt»
wrong (qirq sakkiz): RU «Слева восемь — десятки: восемьдесят четыре.» / UZ "Chapda sakkiz — o'nliklar: sakson to'rt."
wrong (sakkiz to'rt): RU «Читаем по разрядам, не по цифрам.» / UZ "Xonalab o'qiymiz, raqamlab emas."
wrong (sakkiz yuz to'rt): RU «Только двузначное.» / UZ "Faqat ikki xonali."
on_correct: RU «Верно. Восемь десятков и четыре единицы — восемьдесят четыре.» / UZ "To'g'ri. Sakkiz o'nlik va to'rt birlik — sakson to'rt."
audio.intro: RU «Стартовая проверка. Прочитай код на табло.» / UZ "Start tekshiruvi. Displeydagi kodni o'qing."
**FactCard (to'g'ridan keyin):** RU «Знаешь? У числа сто уже три разряда: сотни, десятки, единицы. Их научимся читать позже.» / UZ "Bilasizmi? Yuz sonida uch xona bor: yuzliklar, o'nliklar, birliklar. Ularni keyinroq o'qishni o'rganamiz."
fact_audio: RU «У числа сто три разряда. Сотни, десятки и единицы. Это тема следующих уроков.» / UZ "Yuz sonida uch xona bor. Yuzliklar, o'nliklar va birliklar. Bu keyingi darslar mavzusi."

---

## s15 — YAKUN (scope: final; can-do + kema-sahna §11.7)
mission_done: RU «Миссия выполнена!» / UZ "Missiya bajarildi!"
cando: RU «Теперь ты читаешь и пишешь любой двузначный код.» / UZ "Endi siz har qanday ikki xonali kodni o'qiysiz va yozasiz."
**Audio (payoff + xulosa):**
- S15_PAYOFF: RU «Коды прочитаны и записаны — корабли нашли свои отсеки. Спасибо за помощь!» / UZ "Kodlar o'qildi va yozildi — kemalar o'z bo'limini topdi. Yordamingiz uchun rahmat!"
- summary: RU «Миссия выполнена. Читаем слева направо: десятки, потом единицы. Пишем десяток слева, единицу справа. В следующий раз разберём разрядный состав.» / UZ "Missiya bajarildi. Chapdan o'ngga o'qiymiz: o'nliklar, keyin birliklar. O'nlikni chapga, birlikni o'ngga yozamiz. Keyingi safar razryad tarkibini ko'ramiz."

---

## Bridges (§11 audio-ko'prik, ekranda ko'rinmas)
s2: RU «Начнём с чтения.» / UZ "O'qishdan boshlaymiz." · s3: RU «Прочитали — теперь запишем.» / UZ "O'qidik — endi yozamiz." · s4: RU «А круглые коды?» / UZ "Yumaloq kodlar-chi?" · s5: RU «Соберём всё вместе.» / UZ "Hammasini birga yig'amiz." · s6: RU «Внимание: место важно.» / UZ "Diqqat: o'rin muhim." · s7: RU «Запишем это правилом.» / UZ "Buni qoida qilamiz." · s8–s13: mashq ko'priklari · s14: RU «Финальная проверка.» / UZ "Yakuniy tekshiruv." · s15: RU «Готово — взлетаем!» / UZ "Tayyor — uchamiz!"

---

## Metodist uchun eslatmalar
- **UZ son-nomlari — draft** (o'zbek metodist tasdig'i): qirq, ellik, oltmish, yetmish, sakson, to'qson; o'n bir…o'n to'qqiz. Darslik shakli bilan solishtirilsin.
- **RU jinssiz:** o'quvchiga murojaatда «ты забыл/помог» kabi jinsli fe'l yo'q — buyruq yoki jinssiz shakl.
- **s6/s11 mexanika** = Dars01 s6 digit-plita (slot + raqam-plita), typingsiz.
- **s5 akkordeon** = Dars01 s5 struktura; vizual: kod → mat/nom sinxron.
- Reversal (47/74) va nol-belgisi (40/60) — matematik qoidalar (§11.5) o'qish/yozish kontekstida.
