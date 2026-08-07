# 4-sinf 7–11-nazariy darslar — qayta ishlangan batafsil reja

## 0. Rejaning maqomi

Bu hujjat faqat metodik va ekran ssenariysi hisoblanadi. U tasdiqlanmaguncha
`Dars07.jsx`–`Dars11.jsx` fayllari o'zgartirilmaydi.

Manbalar:

- asosiy etalon — `src/components/grade4/Dars01.jsx`;
- 4-sinf lokal sifat kontrakti va metodologiyasi;
- 1-, 2-, 3- va 5-sinfdagi tayyor nazariy darslarning ishlaydigan mexanikalari;
- mavjud `Dars07.jsx`–`Dars11.jsx` faqat mavzu, misol va misconception manbasi.

## 1. Barcha besh dars uchun qat'iy kontrakt

### 1.1. Ekranlar va pedagogik yoy

Har bir dars aynan 15 slayddan iborat:

1. hook;
2–8. tanish bilimdan yangi tushunchaga olib boruvchi tushuntirish va kashfiyot;
9–14. oltita turli mustahkamlash vazifasi;
15. avtomatik xulosa, hook yechimi va keyingi darsga ko'prik.

### 1.2. Majburiy ichki qadamlar taqiqlanadi

- Slayd ichida `QADAM 1/7`, phase-dots yoki progress-timeline bo'lmaydi.
- Tushuntirishning har bir qismini ochish uchun `Keyingi qadam` bosilmaydi.
- Slaydda faqat umumiy `Orqaga` va `Davom etish` navigatsiyasi qoladi.
- Hisoblash xonalari, raqamlar, strelkalar va natijalar audio bilan sinxron
  avtomatik ochiladi.
- `Qayta ko'rish` tushuntirish slaydlarida ixtiyoriy bo'ladi va ballga ta'sir
  qilmaydi.
- Mashq slaydida ko'pi bilan bitta asosiy matematik vazifa bo'ladi. Matching yoki
  kartochkalardan yozuv yasash bitta yaxlit vazifa hisoblanadi.
- `Davom etish` hech qachon slayd ichidagi animatsiya, karta joylashtirish yoki
  javobga bog'lanmaydi. 9–14-slaydlarda javob berilsa first-try qayd etiladi;
  javob berilmasa ham ekran navigatsiyasi ochiq qoladi.
- 2–8-slaydlar tushuntirish ekranlari. Ularda savol yoki variant ko'rinsa, bu
  faqat ixtiyoriy taxmin: javob kutilmaydi va matematik izoh bloklanmaydi.
  Savol audiosidan keyingi qisqa pauza tugashi bilan to'g'ri model audio va
  mikroanimatsiya orqali avtomatik ochiladi.

### 1.3. Mikroanimatsiya kontrakti

Mikroanimatsiya bezak emas, matematik o'zgarishni ko'rsatadi:

- audio qaysi son yoki xonani aytsa, aynan shu obyekt yonadi;
- ko'chirish tokeni bir xonadan keyingi xonaga real yo'l bilan o'tadi;
- almashtirishda bitta katta xona birligi o'nta kichik birlikka aylanadi;
- to'liqsiz ko'paytma qatori o'z xonasiga real siljiydi;
- xato tahlilida faqat birinchi noto'g'ri xona ajratiladi;
- audio tugagach barcha obyektlar sokin yakuniy holatda qoladi;
- `prefers-reduced-motion` holatida oraliq harakatlar olib tashlanadi, lekin
  matematik yakuniy holat to'liq ko'rinadi.

Ko'paytirish qatori uchun bitta qat'iy texnik model ishlatiladi: avval xom
ko'paytma (`648`, `236`, `708`) ko'rinadi, keyin u faqat bir marta tegishli
xonaga siljib to'liq qiymatga (`6 480`, `2 360`, `70 800`) aylanadi. To'liq
qiymat yozilgach, u qayta gorizontal siljitilmaydi; faqat boshqa qatorlar bilan
birliklar bo'yicha vertikal tekislanadi.

### 1.4. Audio va matn

- Ekrandagi matn qisqa; asosiy tushuntirish audioda.
- Audio segmenti — bitta fikr.
- `A-UZ` va `A-RU` satrlaridagi `|` belgisi avtomatik audio/mikroanimatsiya
  beatlarini ajratadi. Har slayddagi beatlar soni shu segmentlar soniga teng;
  ular alohida frame yoki bosiladigan qadam emas.
- Formulalar ekranda ramz bilan, audioda so'z bilan aytiladi.
- Feedback ichidagi raqamli formula ko'rinadigan matndir. Feedback ovozlanganda
  shu jumlaning sonlari so'z bilan, amal belgilari esa amal nomi bilan aytiladi;
  `×`, `=`, `+`, `−` ramzlari TTSga yuborilmaydi.
- Har bir `Feedback` satridagi UZ/RU juftlik bir vaqtning o'zida feedback audio
  kontraktidir: gap tuzilishi o'zgarmaydi, faqat sonlar locale bo'yicha so'zga
  va formulalar chiziqli nutqqa aylantiriladi. Bu matn CONTENT ichida oldindan
  yoziladi; runtime yoki LLM yangi feedback tuzmaydi.
- UZ matnda faqat `siz` usuli va ASCII apostrof ishlatiladi.
- RU matn matematik ma'no jihatidan UZ bilan bir xil bo'ladi.
- Mute holatida audio matni qisqa captionlar bilan ochiladi.

### 1.5. Bit va kompozitsiya

- Faqat 4-sinf 1-darsdagi tayyor Bit SVG ishlatiladi.
- Bit hook, tipik xato va yakunda faol rol oladi; har bir tushuntirishda bezak
  sifatida takrorlanmaydi.
- Sahifa full-page bo'ladi. Barcha kontentni o'rab turadigan katta card yo'q.
- Card faqat matematik model, savol, isbot yoki feedback kabi semantik blok uchun.

### 1.6. Feedback

- Birinchi xato: tekshirilishi kerak bo'lgan belgi yoki xona so'raladi.
- Ikkinchi xato: kerakli obyekt vizual ajratiladi.
- Uchinchi xato: bitta zarur opora ko'rsatiladi, lekin yakuniy javob berilmaydi.
- To'g'ri javob feedbacki natijani va ishlatilgan matematik belgini aytadi.

---

# 7-dars. Pozitsion va nopozitsion sanoq sistemalari

## Dars pasporti

- **Asosiy maqsad:** o'quvchi o'nlik yozuvda raqam qiymati o'rniga bog'liqligini,
  Rim yozuvida esa `I`, `V`, `X` belgilarining asosiy qiymati saqlanishini
  tushuntiradi va ikki tizimni to'g'ri farqlaydi.
- **Rim yozuvi chegarasi:** faqat 1–20; `I`, `V`, `X`.
- **Asosiy misconception:** “Rim yozuvida tartib ahamiyatsiz” emas. To'g'ri model:
  belgi qiymati saqlanadi, tartib esa qo'shish yoki ayirishni bildiradi.
- **Faol javob ekranlari:** 1 va 9–14 — jami 7/15; 4–5-slaydlarda faqat
  ixtiyoriy qayta manipulyatsiya bor.

## Slaydlar

### 1-slayd — Hook: Bit ko'rgan tik belgi

- **Turi:** hook, baholanmaydi.
- **V-UZ:** `Bit ekranda son o'rniga chiziqchani ko'rdi. Bu bir qarashda bir raqamiga o'xshaydi, lekin biroz farq qiladi. Bit buni 1 raqami deb o'ylayapti. U haqmi?`
- **V-RU:** `Бит увидел на экране знак, похожий на вертикальную черту. С первого взгляда он похож на цифру 1, но немного отличается. Бит думает, что это число 1. Он прав?`
- **Variantlar:**
  - `Ha, bu raqam 1 deb o'qiladi.` / `Да, этот знак читается как 1.`
  - `Yo'q, bir soni boshqacha yoziladi.` / `Нет, число один записывается иначе.`
- **Kompozitsiya:** to'q ko'k sahna; chapda tayyor `Bit-present`, o'ngda terminal;
  terminal markazida katta oq `I`. Variantlar sahna ostida ikki teng tugma.
- **Avtomatik mikroanimatsiya:** terminal yumshoq yonadi; `I` bir marta sokin
  pulse qiladi; Bit ko'zini terminalga buradi. Boshqa harakat yo'q.
- **A-UZ:** `Bit ekranda tik chiziqqa o'xshash belgini ko'rdi.` | `U bu belgini bir deb o'ylayapti.` | `Sizningcha, Bit haqmi?`
- **A-RU:** `Бит увидел на экране знак, похожий на вертикальную черту.` | `Он думает, что этот знак означает один.` | `Как ты думаешь, Бит прав?`
- **Tanlovdan keyin:** `Ajoyib, keling endi buni o'rganib chiqamiz.` /
  `Отлично, теперь разберёмся вместе.` To'g'ri javob hali alohida
  belgilanmaydi; hook taxmin sifatida saqlanadi.

### 2-slayd — Biladigan sonlarimizdan boshlaymiz

- **Turi:** avtomatik prior-knowledge recall.
- **V-UZ:** yuqori qatorda `1   14   403   1 780`; pastki qatorda dastlab hech
  narsa yo'q. Yakuniy caption: `Bu biz biladigan o'nlik sanoq sistemasi.`
- **V-RU:** `1   14   403   1 780`; caption:
  `Это знакомая нам десятичная система счисления.`
- **Avtomatik mikroanimatsiya:** audio davomida `1`, `14`, `403`, `1 780`
  navbat bilan to'q sariq kontur bilan yonadi; aytilgach odatiy holatiga qaytadi.
  So'ng pastda `I   V   IX   XV` yumshoq paydo bo'ladi.
- **A-UZ:** `Bu sonlarni o'qishni bilasiz. Keling, ularni birma-bir aytamiz.` |
  `Bir.` | `O'n to'rt.` | `To'rt yuz uch.` | `Bir ming yetti yuz sakson.` |
  `Ajoyib, bu biz biladigan o'nlik sanoq sistemasi.` |
  `Bugun esa sonlarning mana shunday yozilishini ham o'qishni o'rganamiz.` |
  `Pastdagi belgilar bir, besh, to'qqiz va o'n besh sonlarining Rim yozuvidir.`
- **A-RU:** `Эти числа ты уже умеешь читать. Назовём их по очереди.` | `Один.` |
  `Четырнадцать.` | `Четыреста три.` | `Одна тысяча семьсот восемьдесят.` |
  `Это знакомая нам десятичная система счисления.` |
  `Сегодня мы научимся читать числа, записанные и такими знаками.` |
  `Нижние знаки являются римской записью чисел один, пять, девять и пятнадцать.`
- **Interaksiya:** yo'q; faqat ixtiyoriy `Qayta ko'rish`.

### 3-slayd — Rim yozuvi 1 dan 20 gacha

- **Turi:** avtomatik model va mavzuga ko'prik.
- **V-UZ:** anchor-kartalar `I = 1`, `V = 5`, `X = 10`. Pastda to'rt qator:
  `I II III IV V`; `VI VII VIII IX X`; `XI XII XIII XIV XV`;
  `XVI XVII XVIII XIX XX`. Pastki qisqa qoida:
  `I va X takrorlansa, qiymatlar qo'shiladi. I belgisi V yoki X dan oldin tursa, 1 ayiriladi.`
- **V-RU:** bir xil matematik yozuv; qisqa label:
  `Римская запись чисел от 1 до 20.` Qoida:
  `При повторении I и X значения складываются. Если I стоит перед V или X, единица вычитается.`
- **Avtomatik mikroanimatsiya:** avval `I`, keyin `V`, keyin `X` audio bilan
  yonadi. Qatorlar ketma-ket ochiladi. `IV`, `IX`, `XIV`, `XIX`da kichik `I`
  chapga siljib ayirish yoyini; `VI`, `XI`, `XV`, `XX` qo'shish yoyini ko'rsatadi.
  Hech qanday bosish talab qilinmaydi.
- **A-UZ:** `Rim yozuvida i belgisi birni, ve belgisi beshni, iks belgisi o'nni bildiradi.` |
  `i yoki iks belgisi takrorlansa, ularning qiymatlari qo'shiladi.` |
  `i belgisi ve yoki iks belgisidan keyin tursa, bir qo'shiladi.` |
  `i belgisi ve yoki iks belgisidan oldin tursa, bir ayriladi.` |
  `Shu uchta belgi yordamida birdan yigirmagacha bo'lgan sonlarni yozish mumkin.` |
  `Belgining asosiy qiymati saqlanadi, tartib esa qiymatlar qanday birlashishini ko'rsatadi.`
- **A-RU:** `В римской записи знак и означает один, знак вэ означает пять, знак икс означает десять.` |
  `Если знак и или икс повторяется, их значения складываются.` |
  `Если знак и стоит после вэ или икс, единица прибавляется.` |
  `Если знак и стоит перед вэ или икс, единица вычитается.` |
  `Этих трёх знаков достаточно, чтобы записать числа от одного до двадцати.` |
  `Основное значение знака сохраняется, а порядок показывает, как объединяются значения.`
- **Yakuniy ko'prik:** `14 va XIV bir xil sonni bildiradi, lekin ikki xil usulda yozilgan.` /
  `14 и XIV означают одно число, но записаны двумя разными способами.`

### 4-slayd — O'nlik yozuvda o'rin qiymatni o'zgartiradi

- **Turi:** avtomatik exploration, ixtiyoriy manipulyatsiya.
- **V-UZ:** `14` va yonida ikki xona: `o'nlar | birlar`. Savol:
  `1 raqamini boshqa xonaga ko'chirsangiz, uning qiymati nima bo'ladi?`
- **V-RU:** `Если переместить цифру 1 в другой разряд, каким станет её значение?`
- **Avtomatik mikroanimatsiya:** audio bilan `1` o'nlar xonasidan birlar
  xonasiga o'zi o'tadi; `14 → 41`; `1 = 10`
  labeli `1 = 1`ga o'zgaradi; `4` qarama-qarshi xonaga sokin siljiydi.
- **Ixtiyoriy faoliyat:** avtomatik tushuntirish tugagach o'quvchi tokenni qayta
  ko'chirib ko'rishi mumkin; bu `Davom etish`ni bloklamaydi va ball bermaydi.
- **A-UZ:** `O'n to'rt sonida bir raqami o'nlar xonasida turib, o'nni bildiradi.` |
  `Endi uni birlar xonasiga ko'chiramiz.` | `Bu joyda bir raqami birni bildiradi.` |
  `Demak, o'nlik yozuvda raqam qiymati uning o'rniga bog'liq.`
- **A-RU:** `В числе четырнадцать цифра один стоит в десятках и означает десять.` |
  `Теперь переместим её в разряд единиц.` | `В этом месте цифра один означает единицу.` |
  `Значит, в десятичной записи значение цифры зависит от её места.`

### 5-slayd — Rim belgisining qiymati saqlanadi

- **Turi:** avtomatik exploration, ixtiyoriy manipulyatsiya.
- **V-UZ:** `VI = 6`; savol:
  `I belgisini V ning oldiga ko'chirsangiz, nima o'zgaradi?`
- **V-RU:** `Что изменится, если переместить знак I перед V?`
- **Avtomatik mikroanimatsiya:** audio bilan `I` tokeni `V`ning o'ngidan
  chapiga o'zi ko'chadi; `VI → IV`; `I = 1` va `V = 5` labellari
  o'zgarmaydi; faqat `5 + 1` yoyining o'rniga `5 − 1` yoyi paydo bo'ladi;
  natija `6 → 4` bo'ladi.
- **Ixtiyoriy faoliyat:** avtomatik ko'rsatishdan keyin tokenni ikki tomonga
  ko'chirib natijani qayta ko'rish mumkin; navigatsiya bunga bog'lanmaydi.
- **A-UZ:** `Olti sonining Rim yozuvida i belgisi birni bildiradi va beshga qo'shiladi.` |
  `Endi i belgisini ve belgisining oldiga ko'chiramiz.` | `i belgisi hamon birni bildiradi.` |
  `Lekin tartib o'zgargani uchun endi bir beshdan ayriladi.`
- **A-RU:** `В римской записи числа шесть знак и означает один и прибавляется к пяти.` |
  `Теперь переместим знак и перед знаком вэ.` | `Знак и по-прежнему означает один.` |
  `Но из-за нового порядка единица теперь вычитается из пяти.`

### 6-slayd — Ikki tizimdagi o'rinning vazifasi

- **Turi:** avtomatik comparison.
- **V-UZ:** chap model `14 ↔ 41`; o'ng model `VI ↔ IV`. Pastda ikki xulosa:
  `Raqam qiymati o'zgaradi`; `Belgi qiymati saqlanadi, amal o'zgaradi`.
- **V-RU:** `Значение цифры меняется`; `Значение знака сохраняется, действие меняется`.
- **Avtomatik mikroanimatsiya:** ikki xulosa kartasi audio bilan o'z modelining
  ostiga o'zi joylashadi. `Qayta ko'rish` ixtiyoriy; hech qanday tanlov talab qilinmaydi.
- **A-UZ:** `O'nlik yozuvda o'rin raqamning qiymatini o'zgartirdi.` |
  `Rim yozuvida i belgisining qiymati o'zgarmadi.` |
  `Rim yozuvida tartib qo'shish yoki ayirishni ko'rsatdi.`
- **A-RU:** `В десятичной записи место изменило значение цифры.` |
  `В римской записи значение знака и не изменилось.` |
  `Порядок римских знаков показал сложение или вычитание.`

### 7-slayd — Tizimlarning nomini ochamiz

- **Turi:** avtomatik classification, qoida oldidan kashfiyot.
- **V-UZ:** ikki zona: `Pozitsion` va `Nopozitsion`. Kartalar:
  `Raqam qiymati o'rniga bog'liq`; `Belgi asosiy qiymatini saqlaydi`.
- **V-RU:** `Позиционная`; `Непозиционная`; mos ikki ta'rif.
- **Avtomatik mikroanimatsiya:** ikki ta'rif audio bilan tegishli zona ostiga
  joylashadi; `14 ↔ 41` va `VI ↔ IV` modellari navbat bilan yoritiladi.
- **A-UZ:** `Raqam qiymati turgan o'rniga bog'liq bo'lgan tizim pozitsion deyiladi.` |
  `Belgi o'z asosiy qiymatini saqlaydigan tizim nopozitsion deyiladi.`
- **A-RU:** `Система, в которой значение цифры зависит от места, называется позиционной.` |
  `Система, в которой знак сохраняет основное значение, называется непозиционной.`

### 8-slayd — Qaysi yozuvni qanday o'qiymiz?

- **Turi:** avtomatik rule + strategy.
- **V-UZ:** `14` va `XIV`; usul kartalari:
  `Xonalarni tekshiring`; `Belgilar qiymati va tartibni tekshiring`.
- **V-RU:** `Проверь разряды`; `Проверь значения и порядок знаков`.
- **Avtomatik mikroanimatsiya:** har usul audio bilan tegishli yozuvga o'zi
  joylashadi. Yakunda
  `14 = 1 o'nlik + 4 birlik`; `XIV = X + IV = 14` ochiladi.
- **A-UZ:** `O'nlik yozuvni o'qishda raqamlarning xonasini tekshiramiz.` |
  `Rim yozuvini o'qishda belgilar qiymati va ularning tartibini tekshiramiz.` |
  `Tartib ikkala tizimda ham muhim, lekin uning vazifasi turlicha.`
- **A-RU:** `В десятичной записи проверяем разряды цифр.` |
  `В римской записи проверяем значения знаков и их порядок.` |
  `Порядок важен в обеих системах, но выполняет разные функции.`

### 9-slayd — Test: qiymat qayerda o'zgaradi?

- **Turi:** test-choice, scored.
- **V-UZ:** `Qaysi yozuv pozitsion?`
- **V-RU:** `Какая запись позиционная?`
- **Variantlar:** `14` — to'g'ri; `XIV`; `Ikkalasida ham / В обеих`.
- **A-UZ:** `O'n to'rt va iks, i, ve yozuvlarini taqqoslang.` |
  `Qaysi yozuv pozitsion ekanini tanlang.`
- **A-RU:** `Сравни десятичную запись четырнадцати и запись из знаков икс, и, вэ.` |
  `Выбери позиционную запись.`
- **To'g'ri feedback:** `14 yozuvida 1 o'nlar xonasida turib, 10 ni bildiradi.` /
  `В записи 14 цифра 1 стоит в десятках и означает 10.`
- **Misconceptions:**
  - `XIV`: `Rim yozuvida i, ve va iks belgilarining asosiy qiymati saqlanadi.` /
    `В римской записи знаки и, вэ и икс сохраняют основные значения.`
  - `Ikkalasida`: `Tartib ikkala yozuvda ham muhim, ammo faqat 14 da raqam qiymati xonaga bog'liq.` /
    `Порядок важен в обеих записях, но только в 14 значение цифры зависит от разряда.`

### 10-slayd — Moslashtirish: bir son, ikki yozuv

- **Turi:** drag/tap matching, scored.
- **V-UZ:** `Rim yozuvini son bilan moslang.`
- **V-RU:** `Соедини римскую запись с числом.`
- **Chap kartalar:** `4`, `9`, `14`, `20`.
- **O'ng kartalar:** `XIV`, `XX`, `IV`, `IX` — aralash tartibda.
- **To'g'ri juftlar:** `4–IV`, `9–IX`, `14–XIV`, `20–XX`.
- **A-UZ:** `Har bir o'nlik yozuvni shu sonning Rim yozuvi bilan juftlang.`
- **A-RU:** `Соедини каждую десятичную запись с римской записью того же числа.`
- **Feedback:** xato juft kartalarni qulflamaydi; `I`, `V`, `X` qiymatlari
  kichik eslatma sifatida yonadi. Juftga oid izoh:
  `IV da i ve dan oldin, shuning uchun 1 ayriladi.` /
  `В IV знак и стоит перед вэ, поэтому единица вычитается.`;
  `IX da i iksdan oldin, shuning uchun 1 ayriladi.` /
  `В IX знак и стоит перед икс, поэтому единица вычитается.`;
  `XIV o'n va to'rtdan, XX esa ikkita o'ndan tuzilgan.` /
  `XIV состоит из десяти и четырёх, а XX из двух десятков.`

### 11-slayd — Kartalardan XIV yasang

- **Turi:** construction, scored.
- **V-UZ:** `14 sonini Rim raqamlaridan foydalanib yasang.`
- **V-RU:** `Составь число 14 римскими знаками.`
- **Bo'sh joylar:** uchta slot `□ □ □`.
- **Manba kartalari:** `X`, `I`, `V`, `I`, `X`.
- **To'g'ri yozuv:** `X I V`. Drag va tap-alternativa bir xil ishlaydi.
- **A-UZ:** `O'n to'rt o'n va to'rtga ajraladi.` | `Kerakli belgilarni bo'sh joylarga joylashtiring.`
- **A-RU:** `Четырнадцать состоит из десяти и четырёх.` | `Размести нужные знаки в пустых ячейках.`
- **Feedback:** `XVI` hosil qilinsa: `I V dan keyin qolib ketdi; bu holda u qo'shiladi.` /
  `I осталось после V, поэтому единица прибавляется.`
  `IXV` hosil qilinsa: `14 ni 10 va 4 ga ajrating; ikkinchi qismdagi belgilar tartibini tekshiring.` /
  `Разложи 14 на 10 и 4; проверь порядок знаков во второй части.`
  `XXI` hosil qilinsa: `Ikki X yigirmani bildiradi; 14 uchun bitta X yetadi.` /
  `Два знака X означают двадцать; для 14 достаточно одного X.`
  Boshqa tartibda: `14 ni 10 va 4 ga ajrating. Avval o'nni bildiradigan belgi, keyin to'rtni bildiradigan juftlik kerak.` /
  `Разложи 14 на 10 и 4. Сначала нужен знак десяти, затем пара для четырёх.`

### 12-slayd — Tizimlarga ajrating

- **Turi:** tap-to-bin classification, scored.
- **V-UZ:** `Yozuvlarni ikki sistemaga ajrating.`
- **V-RU:** `Разделите записи на две системы.`
- **Zonalar:** `Pozitsion` va `Nopozitsion`.
- **Kartalar:** `24`, `707`, `18`, `VI`, `XII`, `XIX`.
- **A-UZ:** `Yozuvlarni tizim turiga qarab ikki guruhga ajrating.`
- **A-RU:** `Распредели записи по двум видам систем.`
- **Feedback:** xato kartada “raqam xonasi” yoki “Rim belgisi” belgisi qisqa
  yoritiladi; karta manbaga qaytadi. O'nlik yozuv Rim ustuniga tushsa:
  `Bu o'nlik yozuv; raqam qiymati xonasiga bog'liq.` /
  `Это десятичная запись; значение цифры зависит от разряда.`
  Rim yozuvi pozitsion ustunga tushsa:
  `Bu Rim yozuvi; belgilar asosiy qiymatini saqlaydi.` /
  `Это римская запись; знаки сохраняют основные значения.`

### 13-slayd — Bitning xatosini tuzating

- **Turi:** error repair, scored.
- **V-UZ:** awkward Bit yonidagi yozuv:
  `XIV dagi I belgisi 10 ni bildiradi, chunki u X dan keyin turibdi.`
- **V-RU:** `В записи XIV знак I означает 10, потому что стоит после X.`
- **Tuzatish kartalari:**
  1. `I har doim 1 ni bildiradi; V dan oldin turgani uchun ayriladi.` — to'g'ri.
  2. `I bu yerda 10 ni, X esa 1 ni bildiradi.`
  3. `I va V birgalikda 6 ni bildiradi.`
- **Interaksiya:** to'g'ri tuzatish kartasi Bitning qizil xato jumlasi ustiga
  olib boriladi.
- **A-UZ:** `Bitning hisobida birinchi noto'g'ri fikrni toping.` |
  `Iks belgisi o'nni, i belgisi esa birni bildiradi.` |
  `i belgisi ve dan oldin turgani uchun bir beshdan ayriladi.`
- **A-RU:** `Найди первую неверную мысль в решении Бита.` |
  `Знак икс означает десять, а знак и означает один.` |
  `Знак и стоит перед вэ, поэтому единица вычитается из пяти.`
- **To'g'ri feedback:** `Belgining qiymati o'zgarmadi. Faqat tartib ayirishni ko'rsatdi.` /
  `Значение знака не изменилось. Порядок показал вычитание.`
- **Noto'g'ri feedback:** ikkinchi karta uchun:
  `I va X belgilarining qiymati almashmaydi: i birni, iks o'nni bildiradi.` /
  `Значения знаков не меняются: и означает один, икс означает десять.`;
  uchinchi karta uchun:
  `I ve dan oldin turganda qo'shilmaydi, ayriladi.` /
  `Когда и стоит перед вэ, единица не прибавляется, а вычитается.`

### 14-slayd — Ikki kodga ikki usul

- **Turi:** transfer, scored/final.
- **V-UZ:** `Ikki kodni qanday tekshirasiz?`
- **V-RU:** `Как проверить два кода?`
- **Sahna:** ikkita terminal kodi `404` va `XIV`.
- **Usul kartalari:** `Xonalarga ajratish` / `Разложить по разрядам`;
  `Belgilar qiymati va tartibni tekshirish` / `Проверить значения и порядок знаков`.
- **Interaksiya:** har usul tegishli kodga joylashtiriladi.
- **Avtomatik isbot:** `404 = 400 + 0 + 4`; `XIV = 10 + 4 = 14`.
- **A-UZ:** `Bu ikki kod bir xil usulda o'qilmaydi.` |
  `Har bir kodga mos tekshirish usulini joylashtiring.`
- **A-RU:** `Эти два кода читаются разными способами.` |
  `Подбери способ проверки для каждого кода.`
- **Feedback:** usullar almashtirilsa:
  `404 o'nlik yozuv, XIV esa Rim yozuvi. Har biri uchun o'z qoidasini ishlating.` /
  `404 является десятичной записью, а XIV римской. Используй правило каждой системы.`

### 15-slayd — Avtomatik xulosa

- **Turi:** summary, majburiy refleksiya yo'q.
- **V-UZ:**
  - `Pozitsion: raqam qiymati o'rniga bog'liq.`
  - `Nopozitsion: belgi asosiy qiymatini saqlaydi.`
  - `Rim yozuvida tartib qo'shish yoki ayirishni ko'rsatadi.`
  - `Bit boshidagi belgini to'g'ri tanidi: I = 1.`
- **V-RU:**
  - `Позиционная: значение цифры зависит от места.`
  - `Непозиционная: знак сохраняет основное значение.`
  - `В римской записи порядок показывает сложение или вычитание.`
  - `Бит правильно узнал знак в начале: I = 1.`
- **Avtomatik mikroanimatsiya:** `14 ↔ 41`da `1` qiymati o'zgaradi; `VI ↔ IV`da
  `I = 1` saqlanib, amal belgisi o'zgaradi; oxirida 1-slayddagi navy terminal
  qaytib, `I` yonida `1` ochiladi; so'ng medal va happy Bit paydo bo'ladi.
- **A-UZ:** `O'nlik yozuv pozitsion tizimdir.` |
  `Rim yozuvi nopozitsion tizimga misol bo'ladi.` |
  `Endi siz raqamning o'rni bilan belgilar tartibining vazifasini farqlay olasiz.` |
  `Bit dars boshidagi belgini to'g'ri tanidi. i belgisi birni bildiradi.`
- **A-RU:** `Десятичная запись является позиционной системой.` |
  `Римская запись служит примером непозиционной системы.` |
  `Теперь ты различаешь роль места цифры и порядок знаков.` |
  `Бит правильно узнал знак в начале урока. Знак и означает один.`
- **Ko'prik:** `Keyingi dars: ko'p xonali sonlarni qo'shish va ayirish.` /
  `Следующий урок: сложение и вычитание многозначных чисел.`

---

# 8-dars. Ko'p xonali sonlarni qo'shish va ayirish

## Dars pasporti

- **Asosiy maqsad:** o'quvchi ko'p xonali sonlarni o'ngdan, xona ostiga xona
  qilib joylashtiradi; qo'shishda xona birliklarini yiriklashtiradi, ayirishda
  katta xona birligini maydalaydi; javobni taxmin va teskari amal bilan tekshiradi.
- **Tayanch bilim:** xona qiymati, bir xonali sonlarni qo'shish va ayirish,
  `10 birlik = 1 o'nlik` almashinuvi.
- **Asosiy misconceptions:** chap chetdan tekislash; ko'chirilgan birlikni
  unutish; nolning o'zidan qarz olish; teskari amalni noto'g'ri tanlash.
- **Faol javob ekranlari:** 1 va 9–14 — jami 7/15; 2, 4, 6–8-slaydlardagi
  taxminlar ixtiyoriy va tushuntirishni bloklamaydi.

## Slaydlar

### 1-slayd — Hook: bir misol, ikki natija

- **Turi:** hook, baholanmaydigan tanlov.
- **V-UZ:** `Bit bir xil misoldan ikki natija oldi. Qaysi yozuvga ishonasiz?`
- **V-RU:** `Бит получил два ответа для одного примера. Какой записи ты доверяешь?`
- **Sahna:** tayyor awkward Bit va ikki vertikal terminal. Ikkalasining operand
  labeli aynan `48 392 + 7 605`. Birinchi terminalda `7 605` o'ngdan tekislanib
  `55 997` chiqadi. Ikkinchisida raqam kartalari chapdan joylashadi:
  `7 | 6 | 0 | 5 | bo'sh`; xato natija `124 442`. Operand matnida `76 050`
  yozilmaydi — xato aynan bir xil `7 605` sonining noto'g'ri ustunlarga tushishidir.
- **Variantlar:** `Xonalar o'ngdan tekislangan yozuvga.` /
  `Записи, выровненной справа.`; `Xonalar chapdan tekislangan yozuvga.` /
  `Записи, выровненной слева.`
- **A-UZ:** `Bit qirq sakkiz ming uch yuz to'qson ikkiga yetti ming olti yuz beshni qo'shdi.` |
  `Bir yozuvda birliklar birliklar ostida, ikkinchisida sonlar chapdan tekislangan.` |
  `Qaysi yozuv matematik ma'noni saqlaydi?`
- **A-RU:** `Бит складывал сорок восемь тысяч триста девяносто два и семь тысяч шестьсот пять.` |
  `В одной записи единицы стоят под единицами, а во второй числа выровнены слева.` |
  `Какая запись сохраняет разрядный смысл?`
- **Mikroanimatsiya:** ikki yozuvdagi birlar ustuni audio bilan yonadi; xato
  yozuvdagi `5` o'nliklar ostiga tushganini ko'rsatadigan nozik ogohlantirish
  chizig'i paydo bo'ladi. Tanlovdan keyin: `Javobni xonalar yordamida tekshiramiz.` /
  `Проверим ответ с помощью разрядов.`

### 2-slayd — Sonlarni xona ostiga xona qilib joylashtirish

- **Turi:** avtomatik exploration, ixtiyoriy taxmin.
- **V-UZ:** `32 415 + 6 203`; ko'rsatma:
  `Ikkinchi sonni to'g'ri joyga qo'ying.`
- **V-RU:** `Поставь второе число на правильное место.`
- **Avtomatik mikroanimatsiya:** `6 203` qatori avval uchta mumkin joyni xira
  ko'rsatadi, so'ng audio bilan birlar ustuniga o'zi tushadi. O'quvchi oldin
  variantni bossa taxmini qayd etiladi, lekin izoh uni kutmaydi.
- **A-UZ:** `Sonlar uzunligi turlicha bo'lsa ham, ularni chap tomondan tekislamaymiz.` |
  `Birlar xonasini birlar xonasi ostiga qo'yamiz.` |
  `Shunda har bir xona faqat o'ziga teng xona bilan qo'shiladi.`
- **A-RU:** `Даже если числа разной длины, их не выравнивают слева.` |
  `Поставим единицы под единицами.` |
  `Тогда каждый разряд складывается только с одноимённым разрядом.`
- **Feedback:** xato joylashuvda faqat mos kelmayotgan ustunlar rang va
  `birlar ↔ birlar` labeli bilan ko'rsatiladi; qator erkin qoladi.

### 3-slayd — Almashtirishsiz qo'shish

- **Turi:** avtomatik model.
- **V-UZ:** ustun yozuvi `32 415 + 6 203 = 38 618`; caption:
  `Har xona o'z ustunida hisoblanadi.`
- **V-RU:** `Каждый разряд вычисляется в своём столбце.`
- **A-UZ:** `Birliklardan boshlaymiz.` | `Besh birlik va uch birlik sakkiz birlik bo'ladi.` |
  `Bir o'nlik va nol o'nlik bir o'nlik bo'ladi.` |
  `To'rt yuzlik va ikki yuzlik olti yuzlik bo'ladi.` |
  `Ikki minglik va olti minglik sakkiz minglik bo'ladi.` |
  `Natija o'ttiz sakkiz ming olti yuz o'n sakkiz.`
- **A-RU:** `Начинаем с единиц.` | `Пять единиц и три единицы дают восемь.` |
  `Один десяток и ноль десятков дают один десяток.` |
  `Четыре сотни и две сотни дают шесть сотен.` |
  `Две тысячи и шесть тысяч дают восемь тысяч.` |
  `Получается тридцать восемь тысяч шестьсот восемнадцать.`
- **Mikroanimatsiya:** faol ustun o'ngdan chapga avtomatik ko'chadi; natija
  raqami aytilgan ustun ostiga tushadi. Hech qanday ichki bosish yo'q.

### 4-slayd — Qo'shishda o'nta kichik birlikni almashtirish

- **Turi:** avtomatik discovery, ixtiyoriy taxmin.
- **V-UZ:** `28 467 + 15 785`; markazda `7 birlik + 5 birlik = 12 birlik`.
  Savol: `12 birlikni qanday yozamiz?`
- **V-RU:** `Как записать 12 единиц?`
- **Taxmin variantlari:** `1 o'nlik va 2 birlik` — to'g'ri;
  `12 ni birlar katagiga`; `2 o'nlik va 1 birlik`.
- **A-UZ:** `Yetti birlik va besh birlik o'n ikki birlik bo'ladi.` |
  `O'n ikkita birlikni bitta o'nlik va ikkita birlikka almashtiramiz.` |
  `Ikki birlik natijada qoladi, bitta o'nlik keyingi xonaga o'tadi.`
- **A-RU:** `Семь единиц и пять единиц дают двенадцать единиц.` |
  `Заменим двенадцать единиц одним десятком и двумя единицами.` |
  `Две единицы остаются в ответе, а один десяток переходит в следующий разряд.`
- **Avtomatik davom:** qisqa taxmin pauzasidan keyin to'g'ri almashinuv va
  qolgan ustunlar audio bilan o'z-o'zidan hisoblanadi; `44 252` ochiladi.
  O'n birlikdan bitta o'nlik bog'lami real
  yo'l bilan keyingi ustunga ko'chadi.
- **Feedback:** `12`ni bitta katakka yozish tanlansa:
  `Birlar katagida faqat 0 dan 9 gacha birlik qoladi.` /
  `В разряде единиц остаётся только число от 0 до 9.`

### 5-slayd — Almashtirishsiz ayirish

- **Turi:** avtomatik comparison.
- **V-UZ:** `76 854 − 24 132 = 52 722`; caption:
  `Har xonadan shu xonadagi miqdor ayriladi.`
- **V-RU:** `Из каждого разряда вычитается количество того же разряда.`
- **A-UZ:** `Ayirishda ham sonlarni birlar xonasi bo'yicha tekislaymiz.` |
  `To'rt birlikdan ikki birlikni, besh o'nlikdan uch o'nlikni ayiramiz.` |
  `Har ustunda yuqoridagi raqam yetarli bo'lsa, almashtirish kerak emas.` |
  `Natija ellik ikki ming yetti yuz yigirma ikki.`
- **A-RU:** `При вычитании числа также выравнивают по единицам.` |
  `Из четырёх единиц вычитаем две, а из пяти десятков три.` |
  `Если верхней цифры хватает, размен не нужен.` |
  `Получается пятьдесят две тысячи семьсот двадцать два.`
- **Mikroanimatsiya:** har ustundagi ayirilayotgan bloklar xiralashib chiqadi;
  qolgan bloklar natija raqamiga yig'iladi.

### 6-slayd — Ayirishda katta xona birligini maydalash

- **Turi:** avtomatik exploration, ixtiyoriy donor taxmini.
- **V-UZ:** `63 241 − 27 856`; savol:
  `1 birlikdan 6 birlikni ayirish uchun qaysi xonadan foydalanamiz?`
- **V-RU:** `Из какого разряда возьмём единицу, чтобы вычесть 6 из 1?`
- **Avtomatik mikroanimatsiya:** qisqa pauzada o'quvchi donor ustunini ixtiyoriy
  bosishi mumkin; so'ng `4 o'nlik` ustuni javob kutilmasdan o'zi yoritiladi.
- **A-UZ:** `Bir birlikdan olti birlikni ayirib bo'lmaydi.` |
  `Eng yaqin chapdagi o'nlikdan bitta o'nlikni olamiz.` |
  `Bitta o'nlik o'nta birlikka aylanadi.` |
  `Endi o'n bir birlikdan oltini ayirib, besh birlik qoladi.`
- **A-RU:** `Из одной единицы нельзя вычесть шесть.` |
  `Возьмём один десяток из ближайшего разряда слева.` |
  `Один десяток превращается в десять единиц.` |
  `Теперь из одиннадцати единиц вычитаем шесть, остаётся пять.`
- **Avtomatik davom:** donor yoritilgach qolgan ustunlar avtomatik hisoblanadi;
  har yangi maydalash audio bilan ko'rsatiladi; yakun `35 385`.
- **Feedback:** uzoq donor bosilsa: `Avval eng yaqin chapdagi xonani tekshiring.` /
  `Сначала проверь ближайший разряд слева.`

### 7-slayd — Nollar zanjiri orqali maydalash

- **Turi:** avtomatik exploration, ixtiyoriy donor taxmini.
- **V-UZ:** `40 005 − 17 268`; savol:
  `5 birlik yetmaydi. Chapdagi qaysi raqam birinchi donor bo'la oladi?`
- **V-RU:** `Пяти единиц не хватает. Какая цифра слева первой может стать донором?`
- **Avtomatik mikroanimatsiya:** qisqa pauzada donorni bosib taxmin qilish mumkin;
  keyin `4` o'n minglik o'zi yoritiladi. Oradagi uchta nol donor sifatida
  ko'rsatilmaydi.
- **A-UZ:** `Nolning o'zidan xona birligini olib bo'lmaydi.` |
  `Chapga qarab birinchi nol bo'lmagan xonani topamiz.` |
  `Bitta o'n minglik ketma-ket minglik, yuzlik, o'nlik va birliklarga maydalanadi.` |
  `Shundan keyin har ustunda ayirish mumkin bo'ladi.`
- **A-RU:** `Из нуля нельзя взять разрядную единицу.` |
  `Найдём первый ненулевой разряд слева.` |
  `Один десяток тысяч последовательно разменивается на тысячи, сотни, десятки и единицы.` |
  `После этого вычитание возможно в каждом столбце.`
- **Mikroanimatsiya:** `4 → 3`, nollar bo'ylab `9, 9, 9`, birliklarda `15`
  holati bir uzluksiz yoy bilan ochiladi; so'ng `22 737` avtomatik hisoblanadi.
- **Feedback:** nol tanlansa: `Nol donor bo'la olmaydi; chapdagi birinchi nol bo'lmagan raqamni toping.` /
  `Ноль не может быть донором; найди первую ненулевую цифру слева.`

### 8-slayd — Taxmin va teskari amalning vazifasi

- **Turi:** avtomatik strategy comparison, ixtiyoriy taxmin.
- **V-UZ:** ikki karta: `Taxmin` va `Teskari amal`; ikki vazifa:
  `Javobning kattaligini tekshiradi`; `Aniq hisobni tekshiradi`.
- **V-RU:** `Оценка`; `Обратное действие`; `Проверяет величину ответа`;
  `Проверяет точность вычисления`.
- **Avtomatik mikroanimatsiya:** qisqa taxmindan keyin ikki vazifa audio
  bilan mos kartaga o'zi joylashadi. So'ng `28 467 + 15 785 ≈ 44 000` va
  `44 252 − 15 785 = 28 467` ochiladi.
- **A-UZ:** `Taxmin javob qaysi kattalikda bo'lishi kerakligini ko'rsatadi.` |
  `Teskari amal esa aniq natijani tekshiradi.` |
  `Qo'shish ayirish bilan, ayirish qo'shish bilan tekshiriladi.`
- **A-RU:** `Оценка показывает ожидаемую величину ответа.` |
  `Обратное действие проверяет точный результат.` |
  `Сложение проверяют вычитанием, а вычитание сложением.`

### 9-slayd — Test: to'g'ri tekislangan yozuv

- **Turi:** test-choice, scored.
- **V-UZ:** `84 215 − 19 730 misoli qaysi ustunda to'g'ri yozilgan?`
- **V-RU:** `В каком столбике верно записан пример 84 215 − 19 730?`
- **Variantlar:** uchta ustun yozuvi; faqat birlar ostiga birlar tushgan variant
  to'g'ri. Natija oldindan ko'rsatilmaydi.
- **A-UZ:** `Ayirishdan oldin xonalar joylashuvini tekshiring.`
- **A-RU:** `Перед вычитанием проверь расположение разрядов.`
- **Feedback:** `To'g'ri: sonlar uzunligiga emas, birlar xonasiga qarab tekislanadi.` /
  `Верно: числа выравниваются по единицам, а не по длине.`; xatoda mos kelmagan
  birinchi ustun yoritiladi.

### 10-slayd — Natijani xona kartalaridan yasash

- **Turi:** construction, scored.
- **V-UZ:** `63 708 + 8 596`; pastda javob uchun beshta xona katagi.
- **V-RU:** bir xil formula; `Составь ответ по разрядам.`
- **Manba kartalari:** `7`, `2`, `3`, `0`, `4` va ikkita chalg'ituvchi `1`, `9`.
- **To'g'ri yozuv:** `72 304`.
- **A-UZ:** `Hisobni birliklardan boshlang va hosil bo'lgan raqamlarni o'z xonasiga joylashtiring.`
- **A-RU:** `Начни с единиц и поставь каждую полученную цифру в свой разряд.`
- **Mikroanimatsiya:** to'g'ri karta tushgan ustunda qo'shiluvchilar va ko'chirilgan birlik
  bitta qisqa animatsiyada ko'rinadi; alohida ichki tasdiq yo'q.
- **Feedback:** noto'g'ri karta tushgan slotga qarab:
  - birlar: `8 va 6 yig'indisi 14; 4 yozilib, 1 o'nlik ko'chadi.` /
    `Сумма 8 и 6 равна 14; записывается 4 и переносится 1 десяток.`
  - o'nlar: `0, 9 va ko'chgan 1 yig'indisi 10; o'nlar xonasida 0 qoladi.` /
    `Сумма 0, 9 и переноса 1 равна 10; в десятках остаётся 0.`
  - yuzlar: `7, 5 va ko'chgan 1 yig'indisi 13; yuzlar xonasida 3 qoladi.` /
    `Сумма 7, 5 и переноса 1 равна 13; в сотнях остаётся 3.`
  - minglar: `3, 8 va ko'chgan 1 yig'indisi 12; minglar xonasida 2 qoladi.` /
    `Сумма 3, 8 и переноса 1 равна 12; в тысячах остаётся 2.`
  - o'n minglar: `6 va ko'chgan 1 yig'indisi 7.` /
    `Сумма 6 и переноса 1 равна 7.`
  Maxsus eslatma: `Nol o'nliklar xonasini saqlaydi; uni olib tashlamang.` /
  `Ноль сохраняет разряд десятков; не убирай его.`

### 11-slayd — Birinchi xatoni topish

- **Turi:** error repair, scored.
- **V-UZ:** Bit yozuvi `36 475 + 28 689 = 64 164`; savol:
  `Birinchi xato qaysi xonada paydo bo'lgan?`
- **V-RU:** `В каком разряде впервые появилась ошибка?`
- **Variantlar:** `birlar`, `o'nlar`, `yuzlar`, `minglar`; to'g'ri — `minglar`,
  chunki yuzliklardan kelgan ko'chirilgan birlik qo'shilmagan.
- **A-UZ:** `O'ngdan boshlab har ustunni tekshiring.` |
  `Birinchi noto'g'ri ustunni tanlang, keyingi xatolar uning oqibati bo'lishi mumkin.`
- **A-RU:** `Проверь каждый столбец справа налево.` |
  `Выбери первый неверный разряд; следующие ошибки могут быть его следствием.`
- **Avtomatik tuzatish:** `6 + 8 + 1 = 15`; ko'chgan `1` minglar ustuniga
  tushadi va javob `65 164`ga aylanadi.
- **Feedback:** yakuniy `64` qismiga qarash tanlansa:
  `Xatoning oqibatini emas, birinchi paydo bo'lgan joyini toping.` /
  `Найди источник ошибки, а не её последствие.`

### 12-slayd — Nollar zanjirini tiklash

- **Turi:** state construction, scored.
- **V-UZ:** `60 002 − 24 785`; `2 dan 5 ni ayirishdan oldingi holatni tuzing.`
- **V-RU:** `Составь состояние перед вычитанием 5 из 2.`
- **Kartalar:** chapdagi holat uchun `5 | 9 | 9 | 9 | 12` va chalg'ituvchilar.
- **To'g'ri holat:** `5 o'n minglik, 9 minglik, 9 yuzlik, 9 o'nlik, 12 birlik`.
- **A-UZ:** `Chapdagi birinchi nol bo'lmagan xonada olti o'n minglik bor. Undan bitta o'n minglikni olamiz.` |
  `U nollar zanjiri orqali birliklargacha maydalanadi.`
- **A-RU:** `В первом ненулевом разряде слева есть шесть десятков тысяч. Возьмём один десяток тысяч.` |
  `Она последовательно разменивается через нулевые разряды до единиц.`
- **Yakuniy avtomatika:** holat to'g'ri tuzilgach `35 217` ochiladi.
- **Feedback:** biror nol saqlansa: `Bu nol orqali almashinuv hali oxirigacha yetmagan.` /
  `Размен через этот нулевой разряд ещё не завершён.`

### 13-slayd — Amal va tekshiruvni moslashtirish

- **Turi:** matching, scored.
- **Juftlar:**
  - `27 908 + 6 754 = 34 662` ↔ `34 662 − 6 754 = 27 908`;
  - `84 215 − 19 730 = 64 485` ↔ `64 485 + 19 730 = 84 215`;
  - `60 002 − 24 785 = 35 217` ↔ `35 217 + 24 785 = 60 002`.
- **V-UZ:** `Har hisobni mos teskari amal bilan juftlang.`
- **V-RU:** `Соедини каждое вычисление с подходящей проверкой.`
- **A-UZ:** `Natijadan bir qo'shiluvchini ayirsak, ikkinchi qo'shiluvchi chiqadi.` |
  `Ayirma va ayriluvchini qo'shsak, kamayuvchi qaytadi.`
- **A-RU:** `Если из суммы вычесть одно слагаемое, получится другое.` |
  `Если сложить разность и вычитаемое, получится уменьшаемое.`
- **Feedback:** xato juft chizig'i uziladi va amal belgilarining teskari jufti
  `qo'shish ↔ ayirish` yoritiladi.

### 14-slayd — Shahar kutubxonasi masalasi

- **Turi:** transfer case, scored.
- **V-UZ:** `Kutubxonada 72 000 ta kitob bor edi. 18 756 tasi filiallarga berildi. Nechta kitob qoldi?`
- **V-RU:** `В библиотеке было 72 000 книг. В филиалы передали 18 756. Сколько книг осталось?`
- **Markaziy interaksiya:** bitta neytral sonli input; taxmin uchun alohida
  majburiy input yo'q. Ekranda ixtiyoriy tayanch: `72 000 − 19 000 ≈ 53 000`.
- **To'g'ri javob:** `53 244`.
- **A-UZ:** `Qolgan miqdorni topish uchun ayiramiz.` |
  `Nollar orqali maydalashni va javobning ellik uch ming atrofida bo'lishini tekshiring.`
- **A-RU:** `Чтобы найти остаток, выполняем вычитание.` |
  `Проверь размен через нули и то, что ответ должен быть около пятидесяти трёх тысяч.`
- **Feedback:** `To'g'ri. Ellik uch ming ikki yuz qirq to'rtta kitob qoldi.` /
  `Верно. Осталось пятьдесят три тысячи двести сорок четыре книги.`;
  uzoq javobda taxmin chizig'i, xonaga oid xatoda birinchi mos kelmagan ustun ko'rsatiladi.

### 15-slayd — Avtomatik xulosa

- **Turi:** summary, majburiy refleksiya yo'q.
- **V-UZ:** `Xona ostiga xona`; `10 ta kichik birlik → 1 ta katta birlik`;
  `1 ta katta birlik → 10 ta kichik birlik`; `Taxmin + teskari amal`.
- **V-RU:** `Разряд под разрядом`; `10 меньших единиц → 1 большая`;
  `1 большая единица → 10 меньших`; `Оценка + обратное действие`.
- **A-UZ:** `Qo'shish va ayirishda sonlarni birlar xonasi bo'yicha tekislang.` |
  `Qo'shishda o'nta kichik xona birligini bitta katta xona birligiga almashtiring.` |
  `Ayirishda kerak bo'lsa, chapdagi birinchi nol bo'lmagan xonadan boshlab maydalang.` |
  `Javobni taxmin va teskari amal bilan tekshiring.`
- **A-RU:** `При сложении и вычитании выравнивай числа по единицам.` |
  `При сложении заменяй десять меньших разрядных единиц одной большей.` |
  `При вычитании при необходимости начинай размен с первого ненулевого разряда слева.` |
  `Проверяй ответ оценкой и обратным действием.`
- **Mikroanimatsiya:** hookdagi ikki yozuv qaytadi; chapdan tekislangan qator
  o'ngga siljib to'g'ri ustunlarga tushadi; xato `124 442` o'rniga `55 997`
  ochiladi. Happy Bit va ko'prik:
  `Keyingi dars: ko'p xonali sonni bir xonali songa ko'paytirish.` /
  `Следующий урок: умножение многозначного числа на однозначное.`

---

# 9-dars. Ko'p xonali sonni bir xonali songa ko'paytirish

## Dars pasporti

- **Asosiy maqsad:** o'quvchi ko'p xonali sonni bir xonali songa ko'paytirishni
  teng guruhlar va xona qiymati orqali tushuntiradi, ustun usulida hisoblaydi,
  ko'chirilgan qiymat va ichki nolni saqlaydi, natijani taxmin bilan tekshiradi.
- **Tayanch bilim:** bir xonali sonlar ko'paytirish jadvali, xona qiymati,
  ko'p xonali sonning yoyiq yozuvi.
- **Asosiy misconceptions:** faqat chetdagi raqamni ko'paytirish; ko'chirilgan
  qiymatni unutish; uni noto'g'ri xonaga qo'shish; ichki nol xonasini tashlab ketish;
  ko'paytiruvchini sonning har bir raqamiga qo'shib chiqish.
- **Faol javob ekranlari:** 1 va 9–14 — jami 7/15; 2, 4, 6–8-slaydlardagi
  taxminlar ixtiyoriy va tushuntirish avtomatik davom etadi.

## Slaydlar

### 1-slayd — Hook: natija kattaligi mosmi?

- **Turi:** hook, baholanmaydigan taxmin.
- **V-UZ:** `Har qutida 2 408 ta detal. 3 ta qutida 6 024 ta detal bo'ladimi?`
- **V-RU:** `В каждой коробке 2 408 деталей. В трёх коробках будет 6 024 детали?`
- **Variantlar:** `Ha, natija mos.` / `Да, ответ подходит.`;
  `Yo'q, natija juda kichik.` / `Нет, ответ слишком мал.`
- **Sahna:** uchta bir xil quti va tayyor think Bit; har qutida `2 408`.
- **A-UZ:** `Zaynab uchta bir xil qutini sanadi.` |
  `Har bir qutida ikki ming to'rt yuz sakkizta detal bor.` |
  `U jami olti ming yigirma to'rtta detal chiqdi dedi.` |
  `Sizningcha, bu natija uchta guruhga mos keladimi?`
- **A-RU:** `Зайнаб посчитала три одинаковые коробки.` |
  `В каждой коробке две тысячи четыреста восемь деталей.` |
  `Она получила шесть тысяч двадцать четыре детали.` |
  `Как ты думаешь, подходит ли такой ответ для трёх групп?`
- **Mikroanimatsiya:** uch qutidagi barlar yonma-yon yig'iladi; `6 024` son
  chizig'ida olti ming atrofida, uch guruhning umumiy uzunligi esa yetti ming
  atrofida ko'rinadi. Tanlovdan keyin:
  `Avval sonning har bir xonasini uch marta olamiz.` /
  `Сначала возьмём каждый разряд числа три раза.`

### 2-slayd — Sonni xona qo'shiluvchilariga ajratish

- **Turi:** avtomatik prerequisite recall, ixtiyoriy taxmin.
- **V-UZ:** `2 408 sonining yoyiq yozuvini tanlang.`
- **V-RU:** `Выбери разложение числа 2 408.`
- **Taxmin variantlari:**
  - `2 000 + 400 + 0 + 8` — to'g'ri;
  - `2 000 + 40 + 8`;
  - `200 + 400 + 8`.
- **A-UZ:** `Ko'paytirishdan oldin sonning xona qiymatlarini ko'ramiz.` |
  `Ikki ming to'rt yuz sakkizda ikki minglik, to'rt yuzlik, nol o'nlik va sakkiz birlik bor.`
- **A-RU:** `Перед умножением рассмотрим разрядные значения числа.` |
  `В числе две тысячи четыреста восемь есть две тысячи, четыре сотни, ноль десятков и восемь единиц.`
- **Mikroanimatsiya:** qisqa taxmin pauzasidan keyin `2 408` to'g'ri yoyiq
  yozuvga avtomatik ajraladi; nol o'nlik kartasi ko'rinadigan joyda qoladi.
- **Feedback:** ikkinchi variantda:
  `4 yuzlar xonasida turib, 400 ni bildiradi.` /
  `Цифра 4 стоит в сотнях и означает 400.`; uchinchi variantda:
  `Chapdagi 2 minglar xonasida turib, 2 000 ni bildiradi.` /
  `Цифра 2 слева стоит в тысячах и означает 2 000.`

### 3-slayd — Har bir xona miqdorini uch marta olish

- **Turi:** avtomatik model.
- **V-UZ:**
  `(2 000 × 3) + (400 × 3) + (0 × 3) + (8 × 3) = 7 224`.
- **V-RU:** matematik yozuv bir xil; caption:
  `Каждый разряд берём три раза.`
- **A-UZ:** `Ikki mingni uch marta olsak, olti ming bo'ladi.` |
  `To'rt yuzni uch marta olsak, bir ming ikki yuz bo'ladi.` |
  `Nol o'nlik nol bo'lib qoladi.` |
  `Sakkiz birlikni uch marta olsak, yigirma to'rt bo'ladi.` |
  `Barcha qismlarning yig'indisi yetti ming ikki yuz yigirma to'rt.`
- **A-RU:** `Две тысячи, взятые три раза, дают шесть тысяч.` |
  `Четыре сотни, взятые три раза, дают одну тысячу двести.` |
  `Ноль десятков остаётся нулём.` |
  `Восемь единиц, взятые три раза, дают двадцать четыре.` |
  `Сумма всех частей равна семи тысячам двумстам двадцати четырём.`
- **Mikroanimatsiya:** har xona kartasi uchta nusxaga ko'payadi; nusxalar
  `6 000`, `1 200`, `0`, `24` bloklariga, so'ng xona panjarasidagi `7 224`ga
  avtomatik yig'iladi.

### 4-slayd — Yoyiq modeldan ustun yozuviga

- **Turi:** avtomatik exploration, ixtiyoriy taxmin.
- **V-UZ:** `2 408 × 3`; ko'rsatma:
  `3 ni ustunda qayerga yozamiz?`
- **V-RU:** `Где записать 3 в столбике?`
- **Taxmin variantlari:** `minglar ostiga`, `yuzlar ostiga`,
  `birlar ostiga` — to'g'ri.
- **A-UZ:** `Bir xonali ko'paytiruvchi birliklar ustuniga yoziladi.` |
  `Hisob o'ngdagi birlar xonasidan boshlanadi.` |
  `Shunda har bir natija o'z xona ustunida qoladi.`
- **A-RU:** `Однозначный множитель записывают под единицами.` |
  `Вычисление начинается с правого разряда единиц.` |
  `Тогда каждая цифра результата остаётся в своём столбце.`
- **Mikroanimatsiya:** qisqa taxmin pauzasidan keyin `3` birlar ostiga o'zi
  tushadi; 3-slayddagi yoyiq rangli bloklar ustun yozuviga kiradi va birlar
  ustuni yoritiladi.
- **Feedback:** `Ko'paytiruvchi butun sonni necha marta olishni bildiradi; uni birlar ostiga yozing.` /
  `Множитель показывает, сколько раз берут всё число; запиши его под единицами.`

### 5-slayd — Ko'chirish bilan ustunda ko'paytirish

- **Turi:** avtomatik model.
- **V-UZ:** `3 746 × 4 = 14 984`; caption:
  `Hosil bo'lgan to'liq o'nlik keyingi xonaga o'tadi.`
- **V-RU:** `Получившиеся полные десятки переходят в следующий разряд.`
- **A-UZ:** `Olti to'rt marta olinsa, yigirma to'rt bo'ladi.` |
  `To'rt birlikni yozib, ikki o'nlikni ko'chiramiz.` |
  `To'rt to'rt marta o'n olti, ko'chgan ikki bilan o'n sakkiz.` |
  `Sakkiz o'nlikni yozib, bir yuzlikni ko'chiramiz.` |
  `Yetti to'rt marta yigirma sakkiz, ko'chgan bir bilan yigirma to'qqiz.` |
  `To'qqiz yuzlikni yozib, ikki minglikni ko'chiramiz.` |
  `Uch to'rt marta o'n ikki, ko'chgan ikki bilan o'n to'rt.` |
  `Natija o'n to'rt ming to'qqiz yuz sakson to'rt.`
- **A-RU:** `Шесть, взятое четыре раза, даёт двадцать четыре.` |
  `Записываем четыре единицы и переносим два десятка.` |
  `Четыре, взятое четыре раза, даёт шестнадцать, а с переносом восемнадцать.` |
  `Записываем восемь десятков и переносим одну сотню.` |
  `Семь, взятое четыре раза, даёт двадцать восемь, а с переносом двадцать девять.` |
  `Записываем девять сотен и переносим две тысячи.` |
  `Три, взятое четыре раза, даёт двенадцать, а с переносом четырнадцать.` |
  `Получается четырнадцать тысяч девятьсот восемьдесят четыре.`
- **Mikroanimatsiya:** faol xona o'ngdan chapga yuradi; har to'liq o'nlik
  bitta ko'chirish tokeniga yig'ilib keyingi ustunga o'tadi; token audio aytishidan
  oldin paydo bo'lmaydi.

### 6-slayd — Ko'chirilgan raqamning ma'nosi

- **Turi:** avtomatik exchange, ixtiyoriy taxmin.
- **V-UZ:** `124 × 6`; savol:
  `24 birlikni qanday almashtiramiz?`
- **V-RU:** `Как разменять 24 единицы?`
- **Taxmin variantlari:** `2 o'nlik va 4 birlik` — to'g'ri;
  `24 o'nlik`; `4 o'nlik va 2 birlik`.
- **A-UZ:** `Ko'chirilgan raqam o'zidan paydo bo'lmaydi.` |
  `Olti guruhdagi to'rt birlik yigirma to'rt birlik bo'ladi.` |
  `Yigirma birlik ikki o'nlikka aylanadi, to'rt birlik esa o'z xonasida qoladi.` |
  `Olti guruhdagi ikki o'nlik o'n ikki o'nlik bo'ladi.` |
  `Ko'chgan ikki o'nlik bilan jami o'n to'rt o'nlik hosil bo'ladi.` |
  `To'rt o'nlikni yozib, bir yuzlikni ko'chiramiz.` |
  `Olti yuzlikka ko'chgan bir yuzlik qo'shilsa, yetti yuzlik bo'ladi.`
- **A-RU:** `Переносимая цифра не появляется сама по себе.` |
  `Четыре единицы в шести группах дают двадцать четыре единицы.` |
  `Двадцать единиц превращаются в два десятка, а четыре единицы остаются на месте.` |
  `Два десятка в шести группах дают двенадцать десятков.` |
  `С двумя перенесёнными десятками получается четырнадцать десятков.` |
  `Записываем четыре десятка и переносим одну сотню.` |
  `Шесть сотен и одна перенесённая сотня дают семь сотен.`
- **Avtomatik yakun:** qisqa taxmin pauzasidan keyin bloklar almashadi va
  `124 × 6 = 744` ochiladi.
- **Feedback:** `24`ni bir katakka qoldirish tanlansa:
  `Birlar xonasida faqat 4 birlik qoladi; 20 birlik 2 o'nlikka aylanadi.` /
  `В единицах остаётся 4; двадцать единиц превращаются в два десятка.`
  `4 o'nlik va 2 birlik` tanlansa:
  `24 sonida 2 o'nlik va 4 birlik bor; raqamlarning o'rnini almashtirmang.` /
  `В числе 24 есть 2 десятка и 4 единицы; не меняй цифры местами.`

### 7-slayd — Ichki nol va ko'chirilgan qiymat

- **Turi:** avtomatik taxmin va isbot.
- **V-UZ:** `4 052 × 6`; faol qism: `0 × 6 + 3 = ?`
- **V-RU:** `0 × 6 + 3 = ?`
- **Taxmin variantlari:** `0`, `3` — to'g'ri, `6`.
- **A-UZ:** `Nol turgan xona yo'qolmaydi.` |
  `Nolni olti marta olsak, nol bo'ladi.` |
  `Lekin oldingi xonadan ko'chgan uch yuzlik shu xonaga qo'shiladi.` |
  `Shuning uchun bu ustunda uch yoziladi.`
- **A-RU:** `Разряд с нулём не исчезает.` |
  `Ноль, взятый шесть раз, остаётся нулём.` |
  `Но три сотни из предыдущего переноса прибавляются в этом разряде.` |
  `Поэтому в этом столбце записывается три.`
- **Mikroanimatsiya:** qisqa taxmin pauzasidan keyin nol ustuni kulrang
  ramkada saqlanadi; ko'chirish tokeni aynan shu ustunga tushib `3`ga aylanadi;
  natija `24 312` avtomatik ochiladi.
- **Feedback:** `0` tanlansa:
  `Nolning ko'paytmasi nol, ammo ko'chgan 3 ni ham qo'shish kerak.` /
  `Произведение нуля равно нулю, но нужно прибавить перенос 3.`
  `6` tanlansa: `Bu ustunda nol olti marta olinadi; oltita emas, nol hosil bo'ladi. Keyin ko'chgan 3 qo'shiladi.` /
  `В этом разряде ноль берётся шесть раз; получается не шесть, а ноль. Затем прибавляется перенос 3.`

### 8-slayd — Qulay strategiyani tanlash

- **Turi:** avtomatik strategy comparison, ixtiyoriy taxmin.
- **V-UZ:** `4 999 × 7`; savol: `Qaysi usul qisqaroq?`
- **V-RU:** `Какой способ короче?`
- **Taxmin variantlari:** `Ustunda hisoblash`; `(5 000 − 1) × 7` — eng qulay;
  `4 999 + 7`.
- **A-UZ:** `Ba'zan ustun eng qisqa yo'l bo'lmaydi.` |
  `To'rt ming to'qqiz yuz to'qson to'qqiz besh mingdan bir kam.` |
  `Besh mingni yetti marta olib, ortiqcha olingan yettini ayiramiz.`
- **A-RU:** `Иногда столбик не самый короткий путь.` |
  `Четыре тысячи девятьсот девяносто девять на один меньше пяти тысяч.` |
  `Берём пять тысяч семь раз и вычитаем лишние семь.`
- **Avtomatik isbot:** qisqa taxmin pauzasidan keyin `(5 000 − 1) × 7`
  yoritiladi; `35 000 − 7 = 34 993`; son chizig'ida natija
  `≈ 35 000` taxminiga yaqin tushadi.
- **Feedback:** `4 999 + 7` tanlansa:
  `Ko'paytirishda 4 999 soni yetti marta olinadi; unga faqat 7 qo'shilmaydi.` /
  `При умножении число 4 999 берут семь раз, а не просто прибавляют 7.`

### 9-slayd — Test: teng ifodani topish

- **Turi:** test-choice, scored.
- **V-UZ:** `4 999 × 7 ifodasiga qaysi yozuv aynan teng?`
- **V-RU:** `Какая запись точно равна выражению 4 999 × 7?`
- **Variantlar:** `(5 000 × 7) − 7` — to'g'ri;
  `(5 000 × 7) + 7`; `4 999 + 7`.
- **A-UZ:** `To'rt ming to'qqiz yuz to'qson to'qqiz besh mingdan bir kam.` |
  `U yetti marta olinganda qaysi teng ifoda hosil bo'lishini tanlang.`
- **A-RU:** `Четыре тысячи девятьсот девяносто девять на один меньше пяти тысяч.` |
  `Выбери выражение, которое точно описывает семь таких групп.`
- **Feedback:**
  - `+ 7`: `Besh ming yetti marta olinganda har guruhda bittadan ortiqcha bor; jami 7 ayiriladi.` /
    `При семи группах по пять тысяч взято семь лишних единиц; их нужно вычесть.`
  - `4 999 + 7`: `Ko'paytirish sonni yetti marta olishni bildiradi, unga faqat 7 qo'shishni emas.` /
    `Умножение означает взять число семь раз, а не просто прибавить семь.`

### 10-slayd — Xona natijalarini joylashtirish

- **Turi:** construction, scored.
- **V-UZ:** `(2 000 × 4) + (300 × 4) + (0 × 4) + (6 × 4)`;
  `Oraliq natijalarni mos joyga qo'ying.`
- **V-RU:** `Расположите промежуточные результаты.`
- **Kartalar:** `8 000`, `1 200`, `0`, `24`; to'rtta rangli slot.
- **A-UZ:** `Ikki ming uch yuz olti sonining har bir xona miqdorini to'rt marta oling.`
- **A-RU:** `Возьми каждое разрядное значение числа две тысячи триста шесть четыре раза.`
- **Avtomatik yakun:** barcha kartalar joylashgach ular `9 224`ga yig'iladi;
  ikkinchi submit yo'q.
- **Feedback:** nol tashlab ketilsa:
  `Nol o'nlik to'rt marta olinsa ham nol; uning xona o'rni saqlanadi.` /
  `Ноль десятков, взятый четыре раза, остаётся нулём; его место сохраняется.`

### 11-slayd — Ustun kataklarini to'ldirish

- **Turi:** digit-grid input, scored.
- **V-UZ:** `5 847 × 3`; `Natija kataklarini to'ldiring.`
- **V-RU:** `Заполните ячейки ответа.`
- **To'g'ri javob:** `17 541`.
- **A-UZ:** `Besh ming sakkiz yuz qirq yettini uch marta olib, natijani xonalar bo'yicha yozing.`
- **A-RU:** `Возьми число пять тысяч восемьсот сорок семь три раза и запиши ответ по разрядам.`
- **Interaksiya:** ekrandagi keypad; to'g'ri katak qoladi, faqat noto'g'ri katak
  tozalanadi. O'ngdan ishlash vizual tavsiya, majburiy ketma-ketlik emas.
- **Feedback:**
  - birlar xatosi: `7 ni uch marta olsak, 21; 1 yozilib, 2 o'nlik ko'chadi.` /
    `Семь, взятое три раза, даёт 21; записываем 1 и переносим 2 десятка.`
  - o'nlar xatosi: `4 ni uch marta olgandagi 12 ga ko'chgan 2 ni qo'shing.` /
    `К двенадцати от четырёх, взятого три раза, прибавьте перенос 2.`
  - yuzlar xatosi: `8 ni uch marta olsak, 24; ko'chgan 1 bilan 25 bo'ladi. 5 yozilib, 2 minglik ko'chadi.` /
    `Восемь, взятое три раза, даёт 24; с переносом 1 получается 25. Записывается 5 и переносится 2 тысячи.`
  - minglar xatosi: `5 ni uch marta olsak, 15; ko'chgan 2 bilan 17 bo'ladi.` /
    `Пять, взятое три раза, даёт 15; с переносом 2 получается 17.`
  - yakun: `Natija o'n yetti ming besh yuz qirq bir.` /
    `Получается семнадцать тысяч пятьсот сорок один.`

### 12-slayd — Yo'qolgan nol xonasini tiklash

- **Turi:** error repair, scored.
- **V-UZ:** `Jasurning yechimi: 3 017 × 5 = 15 □ 85`;
  `Yo'qolgan raqamni tiklang.`
- **V-RU:** `Решение Жасура: 3 017 × 5 = 15 □ 85`;
  `Восстановите пропущенную цифру.`
- **Kartalar:** `0` — to'g'ri, `3`, `5`.
- **A-UZ:** `Jasur ichki nol xonasini tashlab yubordi va son qisqarib qoldi.` |
  `Bo'sh yuzlar xonasiga mos raqamni qo'ying.`
- **A-RU:** `Жасур пропустил внутренний нулевой разряд, и число стало короче.` |
  `Поставь подходящую цифру в пустой разряд сотен.`
- **Mikroanimatsiya:** `0` tushganda besh xonali panjara kengayadi va
  `15 085` to'liq ko'rinadi.
- **Feedback:** `Katakni olib tashlash mumkin emas; aks holda o'ngdagi raqamlarning xona qiymati o'zgaradi.` /
  `Ячейку нельзя убирать, иначе изменится разрядное значение цифр справа.`

### 13-slayd — Aniq natijani taxmin bilan juftlash

- **Turi:** matching, scored.
- **Juftlar:**
  - `2 408 × 3 = 7 224` ↔ `≈ 7 200`;
  - `6 110 × 4 = 24 440` ↔ `≈ 24 000`;
  - `1 995 × 5 = 9 975` ↔ `≈ 10 000`.
- **V-UZ:** `Har aniq natijani eng yaqin taxmin bilan juftlang.`
- **V-RU:** `Соедини каждый точный ответ с ближайшей оценкой.`
- **A-UZ:** `Taxmin oxirgi raqamlarni emas, natijaning umumiy kattaligini tekshiradi.`
- **A-RU:** `Оценка проверяет не последние цифры, а общую величину ответа.`
- **Mikroanimatsiya:** to'g'ri juft son chizig'ida yonma-yon nuqtalar bilan
  ko'rsatiladi; xato chiziq ulanmaydi.
- **Feedback:** `Yaqin minglik yoki yuzlikdan foydalanib yana taxmin qiling.` /
  `Снова оцени выражение с помощью ближайших тысяч или сотен.`

### 14-slayd — Ombordagi qutilar

- **Turi:** transfer case, scored.
- **V-UZ:** `6 ta quti. Har birida 2 375 ta detal. Jami nechta detal?`
- **V-RU:** `6 коробок. В каждой 2 375 деталей. Сколько всего деталей?`
- **Tayanch:** `2 400 × 6 ≈ 14 400`; bitta neytral sonli input.
- **To'g'ri javob:** `14 250`.
- **A-UZ:** `Bekzod ombordagi oltita bir xil qutini sanayapti.` |
  `Har qutidagi ikki ming uch yuz yetmish beshta detal olti marta olinadi.` |
  `Javob taxminan o'n to'rt ming to'rt yuz atrofida bo'lishi kerak.`
- **A-RU:** `Бекзод считает шесть одинаковых коробок на складе.` |
  `Количество две тысячи триста семьдесят пять берётся шесть раз.` |
  `Ответ должен быть около четырнадцати тысяч четырёхсот.`
- **Feedback:** `To'g'ri. Jami o'n to'rt ming ikki yuz ellikta detal.` /
  `Верно. Всего четырнадцать тысяч двести пятьдесят деталей.`;
  uzoq javobda taxmin, ko'chirish xatosida birinchi noto'g'ri ustun ajratiladi.

### 15-slayd — Avtomatik xulosa

- **Turi:** summary, majburiy refleksiya yo'q.
- **V-UZ:** `Har bir xona ko'payadi`; `To'liq o'nlik keyingi xonaga o'tadi`;
  `Nol xona o'rnini saqlaydi`; `Javobni taxmin bilan tekshiring`.
- **V-RU:** `Умножается каждый разряд`; `Полные десятки переходят дальше`;
  `Ноль сохраняет разряд`; `Проверяй ответ оценкой`.
- **A-UZ:** `Ko'p xonali sonni bir xonali songa ko'paytirishda har bir xona miqdori ko'paytiriladi.` |
  `O'nta kichik xona birligi bitta katta xona birligiga almashtiriladi.` |
  `Ichki nol o'z xonasini va unga kelgan ko'chirilgan qiymatni saqlaydi.` |
  `Taxmin natijaning kattaligini tekshiradi.`
- **A-RU:** `При умножении многозначного числа на однозначное умножается значение каждого разряда.` |
  `Десять меньших разрядных единиц заменяются одной большей.` |
  `Внутренний ноль сохраняет свой разряд и пришедший перенос.` |
  `Оценка проверяет величину результата.`
- **Mikroanimatsiya:** hookdagi `6 024` xona bloklariga ajraladi; yetishmagan
  `1 200` va birliklar almashinuvi ko'rinib, yozuv `7 224`ga tuzatiladi.
  Happy Bit va ko'prik:
  `Keyingi dars: ko'p xonali sonni ikki xonali songa ko'paytirish.` /
  `Следующий урок: умножение многозначного числа на двузначное.`

---

# 10-dars. Ko'p xonali sonni ikki xonali songa ko'paytirish

## Dars pasporti

- **Asosiy maqsad:** o'quvchi ikki xonali ko'paytiruvchini o'nlik va birlik
  qismlariga ajratadi, ikkita to'liqsiz ko'paytma tuzadi, o'nliklar qatorini
  bir xona chapdan boshlaydi, qatorlarni qo'shadi va javobni taxmin bilan tekshiradi.
- **Tayanch bilim:** 9-darsdagi bir xonali songa ko'paytirish, xona qiymati,
  ko'p xonali sonlarni qo'shish.
- **Asosiy misconceptions:** faqat birliklar raqamiga ko'paytirish; o'nliklar
  raqamini birlik deb olish; ikkinchi qatorni siljitmaslik yoki ikki xona siljitish;
  nol bilan tugagan ko'paytiruvchida xona o'rnini yo'qotish.
- **Faol javob ekranlari:** 1 va 9–14 — jami 7/15; 2, 5 va 8-slaydlardagi
  taxminlar ixtiyoriy, tushuntirish esa avtomatik.

## Slaydlar

### 1-slayd — Hook: Bit hisobni tugatdimi?

- **Turi:** hook, baholanmaydigan gipoteza.
- **V-UZ:** terminalda `324 × 23`; Bitning yechimi `324 × 3 = 972`;
  savol: `Bit hisob tugadi deb o'ylayapti. U haqmi?`
- **V-RU:** `Бит считает, что вычисление закончено. Он прав?`
- **Variantlar:** `Ha, 972 yakuniy javob.` / `Да, 972 — окончательный ответ.`;
  `Yo'q, 23 sonining yana bir qismi bor.` / `Нет, у числа 23 есть ещё одна часть.`
- **A-UZ:** `Bit uch yuz yigirma to'rtni uch birlikka ko'paytirib, to'qqiz yuz yetmish ikki oldi.` |
  `U yigirma uchga ko'paytirish tugadi deb o'ylayapti.` |
  `Siz bunga qo'shilasizmi?`
- **A-RU:** `Бит умножил триста двадцать четыре на три единицы и получил девятьсот семьдесят два.` |
  `Он считает, что умножение на двадцать три закончено.` |
  `Ты с ним согласен?`
- **Kompozitsiya va mikroanimatsiya:** to'q ko'k sahnada awkward Bit va hisob
  terminali; `3` va `972` audio bilan yonadi, keyin `23`dagi `2` sokin puls qiladi.
  Tanlovdan keyin: `Endi 23 sonining ikki qismini tekshiramiz.` /
  `Теперь разберём две части числа 23.`

### 2-slayd — 23 sonining xona tarkibi

- **Turi:** avtomatik decomposition, ixtiyoriy taxmin.
- **V-UZ:** `23 nimalardan tuzilgan?`; taxmin variantlari:
  `20 + 3` — to'g'ri; `2 + 3`; `200 + 3`.
- **V-RU:** `Из чего состоит 23?`; ayni variantlar.
- **A-UZ:** `Yigirma uch sonidagi ikki raqami o'nlar xonasida turadi.` |
  `U ikki o'nlikni, ya'ni yigirmani bildiradi.` |
  `Uch raqami uch birlikni bildiradi.`
- **A-RU:** `Цифра два в числе двадцать три стоит в разряде десятков.` |
  `Она означает два десятка, то есть двадцать.` |
  `Цифра три означает три единицы.`
- **Mikroanimatsiya:** qisqa taxmin pauzasidan keyin `2`dan ikki o'nlik
  blokiga, `3`dan uch birlikka chiziq ochiladi; `23 = 20 + 3` avtomatik yig'iladi.
- **Feedback:** `2 + 3` uchun:
  `2 bu yerda birlik emas, o'nlikni bildiradi.` /
  `Цифра 2 здесь означает десятки, а не единицы.`;
  `200 + 3` uchun: `2 yuzlar emas, o'nlar xonasida.` /
  `Цифра 2 стоит в десятках, а не в сотнях.`

### 3-slayd — 23 ta guruhni ikki qismga ajratish

- **Turi:** avtomatik distributive model.
- **V-UZ:** `23 ta guruh = 20 ta guruh + 3 ta guruh`;
  `324 × 23 = 324 × 20 + 324 × 3`.
- **V-RU:** `23 группы = 20 групп + 3 группы` va shu formula.
- **A-UZ:** `Yigirma uchta teng guruhni yigirmata va uchta guruhga ajratamiz.` |
  `Uch yuz yigirma to'rt soni avval yigirma marta, keyin uch marta olinadi.` |
  `Ikki qismning natijalarini oxirida qo'shamiz.`
- **A-RU:** `Двадцать три равные группы разделим на двадцать групп и три группы.` |
  `Число триста двадцать четыре сначала берётся двадцать раз, затем три раза.` |
  `В конце результаты двух частей складываются.`
- **Mikroanimatsiya:** 23 ta blokdan iborat panel `20` va `3` rangli bo'lakka
  ajraladi; pastda ikki ko'paytma va umumiy yig'indi relsi avtomatik ochiladi.

### 4-slayd — Birliklar qatori

- **Turi:** avtomatik model.
- **V-UZ:** `Birinchi to'liqsiz ko'paytma`; `324 × 3 = 972`;
  `Birliklar qatori birliklardan boshlanadi.`
- **V-RU:** `Первое неполное произведение`; `Строка единиц начинается с единиц.`
- **A-UZ:** `To'rt birlikni uchga ko'paytirib, o'n ikki birlik olamiz.` |
  `Ikki birlikni yozib, bir o'nlikni keyingi xonaga o'tkazamiz.` |
  `Ikki o'nlikni uchga ko'paytirib, ko'chgan birni qo'shsak, yetti o'nlik bo'ladi.` |
  `Uch yuzlikni uchga ko'paytirib, to'qqiz yuzlik olamiz.` |
  `Birinchi to'liqsiz ko'paytma to'qqiz yuz yetmish ikki.`
- **A-RU:** `Четыре единицы умножаем на три и получаем двенадцать единиц.` |
  `Записываем две единицы и переносим один десяток.` |
  `Два десятка умножаем на три и прибавляем перенос. Получаем семь десятков.` |
  `Три сотни умножаем на три и получаем девять сотен.` |
  `Первое неполное произведение равно девятистам семидесяти двум.`
- **Mikroanimatsiya:** faol xona o'ngdan chapga o'tadi; `12 birlik` almashinuvi
  va ko'chirish yoyi audio bilan avtomatik bajariladi.

### 5-slayd — O'nliklar qatori nega bir xona siljiydi?

- **Turi:** avtomatik taxmin va isbot.
- **V-UZ:** `324 × 20 = ?`; taxminlar `648`, `6 480` — to'g'ri, `64 800`;
  caption: `2 raqami 20 ni bildiradi.`
- **V-RU:** `324 × 20 = ?`; `Цифра 2 означает 20.`
- **A-UZ:** `Endi uch yuz yigirma to'rtni yigirmaga ko'paytiramiz.` |
  `Yigirma sonidagi ikki raqami ikki o'nlikni bildiradi.` |
  `Mos natijani tanlang.`
- **A-RU:** `Теперь умножим триста двадцать четыре на двадцать.` |
  `Цифра два в числе двадцать означает два десятка.` |
  `Выбери подходящий результат.`
- **Avtomatik isbot:** qisqa taxmin pauzasidan keyin `324 × 2 = 648`;
  xom `648` qatori bir marta chapga siljib `648 × 10 = 6 480` bo'ladi.
- **Feedback:** `648` tanlansa:
  `Bu ikki birlikka ko'paytma; bizga ikki o'nlik kerak.` /
  `Это произведение на две единицы; нужны два десятка.`;
  `64 800` tanlansa: `O'nliklar qatori ikki emas, bir xona siljiydi.` /
  `Строка десятков сдвигается на один разряд, а не на два.`

### 6-slayd — Ikki to'liqsiz ko'paytmani birlashtirish

- **Turi:** avtomatik model.
- **V-UZ/RU:** `324 × 3 = 972`; `324 × 20 = 6 480`;
  `972 + 6 480 = 7 452`.
- **A-UZ:** `Uch birlikka ko'paytma to'qqiz yuz yetmish ikkiga teng.` |
  `Ikki o'nlikka ko'paytma olti ming to'rt yuz saksonga teng.` |
  `Ikki natijani qo'shib, yetti ming to'rt yuz ellik ikki olamiz.`
- **A-RU:** `Произведение на три единицы равно девятистам семидесяти двум.` |
  `Произведение на два десятка равно шести тысячам четырёмстам восьмидесяти.` |
  `Складываем результаты и получаем семь тысяч четыреста пятьдесят два.`
- **Mikroanimatsiya:** ikki rangli natija xona panjarasida o'ngdan tekislanadi;
  yig'indi raqamlari pastga tushadi.

### 7-slayd — Shu ma'noning ixcham ustun yozuvi

- **Turi:** avtomatik morph.
- **V-UZ:**
  ```text
    324
  ×  23
  -----
    972
   6480
  -----
   7452
  ```
  Caption: `Birliklar — 0 xona; o'nliklar — 1 xona.`
- **V-RU:** `Единицы — 0 разрядов; десятки — 1 разряд.`
- **A-UZ:** `Birinchi qator uch birlikka ko'paytirishni ko'rsatadi.` |
  `Ikkinchi qator ikki o'nlikka ko'paytirishni ko'rsatadi.` |
  `Shuning uchun ikkinchi qator bir xona chapdan boshlanadi.` |
  `Qatorlar qo'shilganda yetti ming to'rt yuz ellik ikki chiqadi.`
- **A-RU:** `Первая строка показывает умножение на три единицы.` |
  `Вторая строка показывает умножение на два десятка.` |
  `Поэтому вторая строка начинается на один разряд левее.` |
  `После сложения получается семь тысяч четыреста пятьдесят два.`
- **Mikroanimatsiya:** 6-slayddagi ikki strip ustun qatorlariga morf bo'ladi.
  Xom `648` bir marta chapga siljib `6 480`ga aylanishi replay qilinadi;
  tayyor `6 480` qayta siljitilmaydi.

### 8-slayd — Birliklar raqami nol bo'lsa

- **Turi:** avtomatik taxmin va isbot.
- **V-UZ:** `1 205 × 30 = ?`; taxminlar `3 615`, `36 150` — to'g'ri,
  `361 500`; caption: `0 birlik, 3 o'nlik`.
- **V-RU:** ayni formula; `0 единиц, 3 десятка`.
- **A-UZ:** `O'ttiz sonining birliklar raqami nol.` |
  `Birliklar uchun to'liqsiz ko'paytma nol bo'ladi.` |
  `Uch raqami esa uch o'nlikni bildiradi.` |
  `Mos natijani tanlang.`
- **A-RU:** `Цифра единиц в числе тридцать равна нулю.` |
  `Неполное произведение для единиц равно нулю.` |
  `Цифра три означает три десятка.` |
  `Выбери подходящий результат.`
- **Mikroanimatsiya:** qisqa taxmin pauzasidan keyin xom
  `1 205 × 3 = 3 615` qatori bir marta chapga siljib
  `36 150`ga aylanadi; nol birliklar relsi xira placeholder bo'lib qoladi.
- **Feedback:** `3 615` uchun: `Bu uch birlikka ko'paytma, bizga uch o'nlik kerak.` /
  `Это произведение на три единицы; нужны три десятка.`;
  `361 500` uchun: `O'nliklar uchun faqat bir xona siljishi kerak.` /
  `Для десятков нужен сдвиг только на один разряд.`

### 9-slayd — Xona va qator siljishini moslashtirish

- **Turi:** matching, scored.
- **V-UZ:** `Ko'paytiruvchi xonasini qator siljishi bilan bog'lang.`
- **V-RU:** `Соедини разряд множителя со сдвигом строки.`
- **Kartalar:** `birliklar raqami`, `o'nliklar raqami`;
  `0 xona siljishi`, `1 xona siljishi`.
- **A-UZ:** `Birliklar raqami uchun qator siljimaydi.` |
  `O'nliklar raqami uchun qator bir xona chapdan boshlanadi.` |
  `Mos juftliklarni tuzing.`
- **A-RU:** `Для цифры единиц строка не сдвигается.` |
  `Для цифры десятков строка начинается на один разряд левее.` |
  `Составь подходящие пары.`
- **Feedback:** teskari juftlikda:
  `Raqamning o'ziga emas, ko'paytiruvchidagi xonasiga qarang.` /
  `Смотри не только на цифру, а на её разряд в множителе.`

### 10-slayd — Qatorlarni joylashtirish

- **Turi:** construction, scored.
- **V-UZ:** `246 × 14 uchun ikki qatorni joylashtiring.`
- **V-RU:** `Размести две строки для 246 × 14.`
- **Slotlar:** birliklar va o'nliklar qatori. **Kartalar:** `984`, `246`,
  `2 460`, `9 840`. To'g'ri kartalar: `984` va `2 460`.
- **A-UZ:** `Birinchi qator to'rt birlikka ko'paytirishni ko'rsatadi.` |
  `Ikkinchi qator bir o'nlikka ko'paytirishni ko'rsatadi.` |
  `Ikki to'g'ri kartani mos qatorga qo'ying.`
- **A-RU:** `Первая строка показывает умножение на четыре единицы.` |
  `Вторая строка показывает умножение на один десяток.` |
  `Помести две верные карточки в подходящие строки.`
- **Interaksiya:** tap yoki drag; ikki slot to'lganda avtomatik tekshiriladi,
  alohida `Tekshirish` yoki ichki bosqich yo'q. To'g'ri holatda `3 444` ochiladi.
- **Feedback:** `246` ikkinchi qatorga qo'yilsa:
  `Bu birga ko'paytma; 1 o'nlar xonasida, shuning uchun 2 460 kerak.` /
  `Это произведение на один; цифра 1 стоит в десятках, поэтому нужно 2 460.`
  `9 840` birinchi qatorga qo'yilsa:
  `Birinchi qator birliklardan boshlanadi; 984 ni chapga siljitmang.` /
  `Первая строка начинается с единиц; не сдвигай 984 влево.`
  `984` va `2 460` o'zaro almashtirilsa:
  `984 birliklar qatori, 2 460 o'nliklar qatoridir. Ularni o'z relsiga qaytaring.` /
  `984 является строкой единиц, а 2 460 строкой десятков. Верни их на свои ряды.`

### 11-slayd — Mustaqil sonli javob

- **Turi:** numeric input, scored.
- **V-UZ:** `417 × 32 = ?`; `Javobni kiriting.`
- **V-RU:** `417 × 32 = ?`; `Введи ответ.`
- **To'g'ri javob:** `13 344`.
- **A-UZ:** `To'rt yuz o'n yettini o'ttiz ikkiga ko'paytiring.` |
  `Avval javobning kattaligini taxmin qiling.` |
  `Keyin ikkita to'liqsiz ko'paytmani qo'shing.`
- **A-RU:** `Умножь четыреста семнадцать на тридцать два.` |
  `Сначала оцени величину ответа.` |
  `Затем сложи два неполных произведения.`
- **To'g'ri javobdan keyin:** `417 × 2 = 834`;
  `417 × 30 = 12 510`; `834 + 12 510 = 13 344` avtomatik ochiladi.
- **Feedback:** juda kichik javobda:
  `Javob taxminan o'n ikki mingdan katta bo'lishi kerak.` /
  `Ответ должен быть больше примерно двенадцати тысяч.`;
  ikkinchi xatoda ikki to'g'ri qator ko'rsatiladi, yig'indi berilmaydi.

### 12-slayd — Qulay strategiyani tanlash

- **Turi:** strategy choice, scored.
- **V-UZ:** `500 × 24 uchun qaysi usul eng qulay?`
- **V-RU:** `Какой способ удобнее для 500 × 24?`
- **Variantlar:** `500 × 20 + 500 × 4` — to'g'ri; `500 + 24`;
  `24 × 5 va nollarni olib tashlash`.
- **A-UZ:** `Besh yuz yaxlit son.` |
  `Yigirma to'rtni yigirma va to'rtga ajratish hisobni qisqartiradi.` |
  `Eng qulay ishonchli usulni tanlang.`
- **A-RU:** `Пятьсот является круглым числом.` |
  `Разложение двадцати четырёх на двадцать и четыре сокращает вычисление.` |
  `Выбери самый удобный надёжный способ.`
- **Avtomatik isbot:** `500 × 20 = 10 000`; `500 × 4 = 2 000`;
  `10 000 + 2 000 = 12 000`.
- **Feedback:** `500 + 24` uchun:
  `Qo'shish yigirma to'rtta teng guruhni bermaydi.` /
  `Сложение не создаёт двадцать четыре равные группы.`;
  nollarni olib tashlash uchun: `Nollar xona qiymatini saqlaydi; ularni shunchaki olib tashlab bo'lmaydi.` /
  `Нули сохраняют разрядное значение; их нельзя просто убрать.`

### 13-slayd — Bitning ikkinchi qator xatosi

- **Turi:** error repair, scored.
- **V-UZ:** Bitning yozuvi:
  ```text
    213
  ×  12
  -----
    426
    213
  -----
    639
  ```
  Savol: `Birinchi xato nimada?`
- **V-RU:** `В чём первая ошибка?`
- **Variantlar:** `Ikkinchi qator bir xona chapdan boshlanishi kerak` — to'g'ri;
  `Birinchi qator 213 bo'lishi kerak`; `Qatorlarni qo'shib bo'lmaydi`.
- **A-UZ:** `Bit ikki yuz o'n uchni o'n ikkiga ko'paytirdi.` |
  `U ikkinchi qatorda bir o'nlikning xona qiymatini yo'qotdi.` |
  `Birinchi noto'g'ri joyni toping.`
- **A-RU:** `Бит умножал двести тринадцать на двенадцать.` |
  `Во второй строке он потерял разрядное значение одного десятка.` |
  `Найди первое неверное место.`
- **Avtomatik tuzatish:** `213` qatori bir xona chapga siljib `2 130`
  bo'ladi; yig'indi `2 556`ga qayta hisoblanadi.
- **Feedback:** birinchi qator tanlansa:
  `426 — bu 213 ni 2 ga ko'paytirish natijasi; u to'g'ri.` /
  `426 — произведение 213 на 2; эта строка верна.`
  `Qatorlarni qo'shib bo'lmaydi` tanlansa:
  `To'liqsiz ko'paytmalar xona bo'yicha tekislangach qo'shiladi.` /
  `Неполные произведения складываются после выравнивания по разрядам.`

### 14-slayd — Shahar panellari

- **Turi:** transfer case, scored.
- **V-UZ:** `24 ta panelning har birida 128 ta sensor. Qaysi to'liqsiz ko'paytmalar kerak?`
- **V-RU:** `В каждой из 24 панелей по 128 датчиков. Какие неполные произведения нужны?`
- **Variantlar:** `512 va 2 560` — to'g'ri; `512 va 256`;
  `1 280 va 2 400`.
- **A-UZ:** `Har bir panelda bir yuz yigirma sakkizta sensor bor.` |
  `Yigirma to'rtta panel uchun to'rt birlik va ikki o'nlik qismlarini hisobga oling.` |
  `Mos ikkita natijani tanlang.`
- **A-RU:** `В каждой панели находится сто двадцать восемь датчиков.` |
  `Для двадцати четырёх панелей учти четыре единицы и два десятка.` |
  `Выбери два подходящих результата.`
- **Mikroanimatsiya:** `512` va `2 560` xona bo'yicha tekislanadi;
  `3 072` natija tushadi va panel indikatorlari yonadi.
- **Feedback:** `512 va 256` uchun:
  `256 ikkiga ko'paytma; bizga yigirmaga ko'paytma kerak.` /
  `256 — произведение на два; нужно произведение на двадцать.`
  `1 280 va 2 400` uchun:
  `Ko'paytiruvchining qismlari 20 va 4; har ikkisini 128 ga ko'paytiring.` /
  `Части множителя равны двадцати и четырём; каждую умножь на 128.`

### 15-slayd — Avtomatik xulosa

- **Turi:** summary, majburiy refleksiya yo'q.
- **V-UZ:** `Birliklar qatori — 0 xona`; `O'nliklar qatori — 1 xona`;
  `To'liqsiz ko'paytmalarni qo'shing`; `Natijani taxmin bilan tekshiring`.
- **V-RU:** `Строка единиц — 0 разрядов`; `Строка десятков — 1 разряд`;
  `Сложи неполные произведения`; `Проверь результат оценкой`.
- **A-UZ:** `Ikki xonali ko'paytiruvchi birliklar va o'nliklarga ajraladi.` |
  `Birliklar qatori siljimaydi.` |
  `O'nliklar qatori bir xona chapdan boshlanadi.` |
  `To'liqsiz ko'paytmalar qo'shiladi va natija taxmin bilan tekshiriladi.`
- **A-RU:** `Двузначный множитель раскладывается на единицы и десятки.` |
  `Строка единиц не сдвигается.` |
  `Строка десятков начинается на один разряд левее.` |
  `Неполные произведения складываются, а результат проверяется оценкой.`
- **Mikroanimatsiya:** hookdagi yolg'iz `972` qatoriga xom `648` keladi,
  bir marta chapga siljib `6 480`ga aylanadi va qo'shiladi; `7 452` ochiladi.
  Happy Bit va uchinchi bo'sh rels
  keyingi darsga ko'prik bo'ladi:
  `Keyingi dars: yuzliklar qatori ham qo'shiladi.` /
  `Следующий урок: добавится строка сотен.`

---

# 11-dars. Ko'p xonali sonni uch xonali songa ko'paytirish

## Dars pasporti

- **Asosiy maqsad:** o'quvchi uch xonali ko'paytiruvchini yuzlik, o'nlik va
  birlik qismlariga ajratadi; uchta to'liqsiz ko'paytmani 0, 1 va 2 xona
  siljishi bilan joylashtiradi; o'rtadagi nolning xona o'rnini saqlaydi;
  qatorlarni qo'shib, javobni taxmin bilan tekshiradi.
- **Tayanch bilim:** 10-darsdagi ikki qatorli model va o'nliklar qatorining
  bir xona siljishi.
- **Asosiy misconceptions:** uchinchi qatorni unutish; yuzliklar qatorini faqat
  bir xona siljitish; ko'paytiruvchidagi nolni olib tashlash; taxminni aniq
  javob deb qabul qilish.
- **Faol javob ekranlari:** 1 va 9–14 — jami 7/15; 2–3 va 6–7-slaydlardagi
  taxminlar ixtiyoriy, tushuntirish esa avtomatik.

## Slaydlar

### 1-slayd — Hook: natija qanchalik katta?

- **Turi:** hook, baholanmaydigan taxmin.
- **V-UZ:** `1 panel — 236 ta kontakt`; `314 ta panel`; `236 × 314`;
  savol: `Natija qaysi oraliqda bo'ladi?`
- **V-RU:** `1 панель — 236 контактов`; `314 панелей`;
  `В каком диапазоне будет результат?`
- **Variantlar:** `7 000–8 000`; `70 000–80 000` — to'g'ri;
  `700 000–800 000`.
- **A-UZ:** `Bitta panelga ikki yuz o'ttiz oltita kontakt kerak.` |
  `Shahar uch yuz o'n to'rtta bir xil panel o'rnatmoqda.` |
  `Aniq hisoblamasdan javobning kattaligini taxmin qiling.`
- **A-RU:** `Для одной панели нужны двести тридцать шесть контактов.` |
  `Город устанавливает триста четырнадцать одинаковых панелей.` |
  `Не вычисляя точно, оцени величину ответа.`
- **Kompozitsiya:** to'q ko'k sahna, think Bit, panel va diapazon terminali.
- **Mikroanimatsiya:** `236` va `314` audio bilan yonadi; yuztadan uch guruh
  konturi ko'rinib, natijaning o'n minglar tartibida bo'lishini vizual sezdiradi.
  Tanlovdan keyin: `Taxmin saqlandi. Endi 314 sonining tuzilishini tekshiramiz.` /
  `Оценка сохранена. Теперь разберём строение числа 314.`

### 2-slayd — 314 sonining xona tarkibi

- **Turi:** avtomatik decomposition, ixtiyoriy taxmin.
- **V-UZ/RU:** `314 = ?`; variantlar:
  `300 + 10 + 4` — to'g'ri; `30 + 10 + 4`; `300 + 100 + 4`;
  `3 000 + 10 + 4`.
- **A-UZ:** `Uch yuz o'n to'rt sonidagi uch raqami yuzlar xonasida turadi.` |
  `Bir raqami o'nlar xonasida turadi.` |
  `To'rt raqami birlar xonasida turadi.` |
  `Sonning to'g'ri yoyiq yozuvini tanlang.`
- **A-RU:** `Цифра три в числе триста четырнадцать стоит в разряде сотен.` |
  `Цифра один стоит в разряде десятков.` |
  `Цифра четыре стоит в разряде единиц.` |
  `Выбери верное разложение числа.`
- **Mikroanimatsiya:** qisqa taxmin pauzasidan keyin `3 → 300`,
  `1 → 10`, `4 → 4` bog'lanishlari audio bilan avtomatik chiziladi.
- **Feedback:** har xatoda faqat noto'g'ri talqin qilingan xona aytiladi:
  `3 yuzlar xonasida, o'nlar yoki minglar xonasida emas.` /
  `Цифра 3 стоит в сотнях, а не в десятках или тысячах.`;
  `1 bu yerda 10 ni bildiradi, 100 ni emas.` /
  `Цифра 1 здесь означает 10, а не 100.`

### 3-slayd — Nechta qator kerak?

- **Turi:** avtomatik conceptual reveal, ixtiyoriy taxmin.
- **V-UZ:** `314 = 300 + 10 + 4`; `Nechta to'liqsiz ko'paytma kerak?`
- **V-RU:** `Сколько неполных произведений нужно?`
- **Taxmin variantlari:** `2 ta`; `3 ta` — to'g'ri; `314 ta`.
- **A-UZ:** `Ikki xonali ko'paytiruvchida ikkita qator ishlatgan edik.` |
  `Uch yuz o'n to'rt sonida uchta xona qismi bor.` |
  `Nechta to'liqsiz ko'paytma kerakligini tanlang.`
- **A-RU:** `Для двузначного множителя мы использовали две строки.` |
  `В числе триста четырнадцать есть три разрядные части.` |
  `Выбери количество неполных произведений.`
- **Mikroanimatsiya:** qisqa taxmin pauzasidan keyin birlik, o'nlik va
  yuzlik uchun uch rels konturi ochiladi; `0`, `1`, `2` xona labeli avtomatik paydo bo'ladi.
- **Feedback:** `2 ta` uchun:
  `Ikki qator birlik va o'nlikni qoplaydi, lekin yuzlik qismi qolib ketadi.` /
  `Две строки учитывают единицы и десятки, но теряют сотни.`;
  `314 ta` uchun: `Har bir guruhga emas, har bir xona qismiga bitta qator kerak.` /
  `Нужна одна строка для каждой разрядной части, а не для каждой группы.`

### 4-slayd — Bitta misol uchta sodda misolga ajraladi

- **Turi:** avtomatik distributive model.
- **V-UZ/RU:** `236 × 314`; `314 = 300 + 10 + 4`;
  `236 × 300`; `236 × 10`; `236 × 4`.
- **A-UZ:** `Uch yuz o'n to'rtni uch yuz, o'n va to'rtga ajratamiz.` |
  `Ikki yuz o'ttiz oltini har bir xona qismiga alohida ko'paytiramiz.` |
  `Oxirida uchta natijani qo'shamiz.`
- **A-RU:** `Триста четырнадцать раскладываем на триста, десять и четыре.` |
  `Двести тридцать шесть отдельно умножаем на каждую разрядную часть.` |
  `В конце складываем три результата.`
- **Mikroanimatsiya:** katta formula uchta rangli tarmoqqa ajraladi; birlik,
  o'nlik, yuzlik tarmoqlari audio bilan ochilib, pastdagi bitta yig'indi relsiga ulanadi.

### 5-slayd — Birliklar qatori

- **Turi:** avtomatik model.
- **V-UZ:** `236 × 4 = 944`; `Birliklar qatori — 0 xona siljishi`.
- **V-RU:** `Строка единиц — сдвиг на 0 разрядов.`
- **A-UZ:** `Olti birlikni to'rtga ko'paytirib, yigirma to'rt birlik olamiz.` |
  `To'rt birlikni yozib, ikki o'nlikni ko'chiramiz.` |
  `Uch o'nlikni to'rtga ko'paytirib, ko'chgan ikki bilan o'n to'rt o'nlik olamiz.` |
  `Ikki yuzlikni to'rtga ko'paytirib, ko'chgan bir bilan to'qqiz yuzlik olamiz.` |
  `Birinchi to'liqsiz ko'paytma to'qqiz yuz qirq to'rt.`
- **A-RU:** `Шесть единиц умножаем на четыре и получаем двадцать четыре.` |
  `Записываем четыре и переносим два десятка.` |
  `Три десятка умножаем на четыре и с переносом получаем четырнадцать десятков.` |
  `Две сотни умножаем на четыре и с переносом получаем девять сотен.` |
  `Первое неполное произведение равно девятистам сорока четырём.`
- **Mikroanimatsiya:** faol xona va ko'chirish yoyi o'ngdan chapga audio bilan
  avtomatik yuradi; qator siljimay birliklar relsida qoladi.

### 6-slayd — O'nliklar qatori

- **Turi:** avtomatik taxmin va isbot.
- **V-UZ:** `236 × 10 = ?`; variantlar `236`, `2 360` — to'g'ri, `23 600`;
  `O'nliklar qatori — 1 xona siljishi`.
- **V-RU:** `Строка десятков — сдвиг на 1 разряд.`
- **A-UZ:** `Uch yuz o'n to'rt sonidagi bir raqami bir o'nlikni bildiradi.` |
  `Ikki yuz o'ttiz oltini bir o'nlikka ko'paytirish natijasini tanlang.`
- **A-RU:** `Цифра один в числе триста четырнадцать означает один десяток.` |
  `Выбери результат умножения двухсот тридцати шести на один десяток.`
- **Avtomatik isbot:** qisqa taxmin pauzasidan keyin xom
  `236 × 1 = 236` qatori bir marta chapga siljib
  `2 360` bo'ladi.
- **Feedback:** `236` uchun: `Bu bir birlikka ko'paytma; bizga bir o'nlik kerak.` /
  `Это произведение на одну единицу; нужен один десяток.`;
  `23 600` uchun: `O'nliklar qatori ikki emas, bir xona siljiydi.` /
  `Строка десятков сдвигается на один разряд, а не на два.`

### 7-slayd — Yuzliklar qatori

- **Turi:** avtomatik taxmin va isbot.
- **V-UZ:** `236 × 300 = ?`; variantlar `708`, `7 080`,
  `70 800` — to'g'ri; `Yuzliklar qatori — 2 xona siljishi`.
- **V-RU:** `Строка сотен — сдвиг на 2 разряда.`
- **A-UZ:** `Uch raqami yuzlar xonasida turib, uch yuzni bildiradi.` |
  `Ikki yuz o'ttiz oltini uch yuzga ko'paytirish natijasini tanlang.`
- **A-RU:** `Цифра три стоит в разряде сотен и означает триста.` |
  `Выбери результат умножения двухсот тридцати шести на триста.`
- **Avtomatik isbot:** qisqa taxmin pauzasidan keyin `236 × 3 = 708`;
  xom `708` qatori bir marta ikki xona chapga siljib
  `70 800` bo'ladi.
- **Feedback:** `708` uchun: `Bu uch birlikka ko'paytma; 3 bu yerda 300 ni bildiradi.` /
  `Это произведение на три единицы; здесь 3 означает 300.`;
  `7 080` uchun: `Yuzliklar qatori bir emas, ikki xona chapdan boshlanadi.` /
  `Строка сотен начинается на два разряда левее, а не на один.`

### 8-slayd — Uch qator bitta natijani beradi

- **Turi:** avtomatik synthesis.
- **V-UZ/RU:**
  ```text
      236
    × 314
    -----
      944
     2360
    70800
    -----
    74104
  ```
  `74 104` natijasi `70 000–80 000` oraliqda belgilanadi.
- **A-UZ:** `Birliklar qatori to'qqiz yuz qirq to'rt.` |
  `O'nliklar qatori ikki ming uch yuz oltmish.` |
  `Yuzliklar qatori yetmish ming sakkiz yuz.` |
  `Uch qatorning yig'indisi yetmish to'rt ming bir yuz to'rt.` |
  `Natija dars boshidagi yetmish mingdan sakson minggacha oraliqqa mos.`
- **A-RU:** `Строка единиц равна девятистам сорока четырём.` |
  `Строка десятков равна двум тысячам трёмстам шестидесяти.` |
  `Строка сотен равна семидесяти тысячам восьмистам.` |
  `Сумма трёх строк равна семидесяти четырём тысячам ста четырём.` |
  `Результат входит в диапазон от семидесяти до восьмидесяти тысяч.`
- **Mikroanimatsiya:** replay xom `944`, `236`, `708` qatorlaridan boshlanadi;
  ular mos ravishda nol, bir va ikki xona siljib `944`, `2 360`, `70 800`ga
  aylanadi. Shundan keyin tayyor qiymatlar faqat vertikal tekislanib qo'shiladi;
  qayta siljitilmaydi. Hookdagi to'g'ri diapazon yonadi.

### 9-slayd — 0, 1 va 2 xona siljishini moslashtirish

- **Turi:** matching, scored.
- **V-UZ:** `Har bir qismni qator siljishi bilan bog'lang.`
- **V-RU:** `Соедини каждую часть со сдвигом строки.`
- **Kartalar:** `4 birlik`, `1 o'nlik`, `3 yuzlik`; `0 xona`, `1 xona`, `2 xona`.
- **A-UZ:** `Birliklar qatori siljimaydi.` |
  `O'nliklar qatori bir xona chapdan boshlanadi.` |
  `Yuzliklar qatori ikki xona chapdan boshlanadi.` |
  `Mos juftliklarni tuzing.`
- **A-RU:** `Строка единиц не сдвигается.` |
  `Строка десятков начинается на один разряд левее.` |
  `Строка сотен начинается на два разряда левее.` |
  `Составь подходящие пары.`
- **Feedback:** `Raqamning o'ziga emas, ko'paytiruvchidagi xonasiga qarang.` /
  `Смотри не только на цифру, а на её разряд в множителе.`

### 10-slayd — O'rtadagi nol bilan qator qurish

- **Turi:** construction, scored.
- **V-UZ:** `132 × 204 uchun uch qatorni joylashtiring.`
- **V-RU:** `Размести три строки для 132 × 204.`
- **Kartalar:** `528`, `0`, `2 640`, `26 400`, `5 280`; uchta rels.
  To'g'ri qatorlar: `528`, `0`, `26 400`.
- **A-UZ:** `Ikki yuz to'rt sonida to'rt birlik, nol o'nlik va ikki yuzlik bor.` |
  `Nol o'nlik qatori natijani oshirmaydi, lekin o'z xona o'rnini saqlaydi.` |
  `Uchta to'g'ri qatorni joylashtiring.`
- **A-RU:** `В числе двести четыре есть четыре единицы, ноль десятков и две сотни.` |
  `Нулевая строка десятков не увеличивает результат, но сохраняет разрядное место.` |
  `Размести три правильные строки.`
- **Interaksiya:** barcha kartalar va relslar bir paytda ochiq; tap yoki drag;
  uch rels to'lgach avtomatik tekshirish. Alohida ichki submit yo'q.
- **Mikroanimatsiya:** nol qatori xira placeholderga aylanadi. `26 400`
  kartasi allaqachon yuzliklar qiymatini o'z ichiga oladi, shuning uchun u
  qayta siljitilmaydi; faqat birliklar bo'yicha vertikal tekislanadi. So'ng
  `26 928` yig'indisi ochiladi.
- **Feedback:** `2 640` yuzlik qatoriga qo'yilsa:
  `Bu faqat bir xona siljigan; 2 yuzlar xonasida, shuning uchun ikki xona kerak.` /
  `Эта строка сдвинута на один разряд; цифра 2 стоит в сотнях, поэтому нужны два.`
  `5 280` birliklar qatoriga qo'yilsa:
  `132 ni 4 ga ko'paytirish 528 bo'ladi; birliklar qatorini chapga siljitmang.` /
  `Произведение 132 на 4 равно 528; не сдвигай строку единиц влево.`
  Nol qatori tashlab ketilsa:
  `Ixcham yozuvda nol qatori xira bo'lishi mumkin, lekin o'nliklar o'rni saqlanadi.` /
  `В компактной записи нулевая строка может быть скрыта, но место десятков сохраняется.`
  To'g'ri kartalar o'zaro almashtirilsa:
  `528 birliklar qatori, 0 o'nliklar qatori, 26 400 yuzliklar qatoridir. Har birini o'z relsiga qaytaring.` /
  `528 является строкой единиц, 0 строкой десятков, а 26 400 строкой сотен. Верни каждую карточку на свой ряд.`

### 11-slayd — Mustaqil sonli javob

- **Turi:** numeric input, scored.
- **V-UZ:** `145 × 326 = ?`; `Javobni kiriting.`
- **V-RU:** `145 × 326 = ?`; `Введи ответ.`
- **To'g'ri javob:** `47 270`.
- **A-UZ:** `Bir yuz qirq beshni uch yuz yigirma oltiga ko'paytiring.` |
  `Birliklar, o'nliklar va yuzliklar qatorlarini to'g'ri joylashtiring.` |
  `Natijani taxminan qirq besh ming bilan solishtiring.`
- **A-RU:** `Умножь сто сорок пять на триста двадцать шесть.` |
  `Правильно размести строки единиц, десятков и сотен.` |
  `Сравни результат с оценкой примерно сорок пять тысяч.`
- **To'g'ri javobdan keyin:** `145 × 6 = 870`; `145 × 20 = 2 900`;
  `145 × 300 = 43 500`; jami `47 270` avtomatik ochiladi.
- **Feedback:** uzoq javobda:
  `Javob qirq besh mingga yaqin bo'lishi kerak.` /
  `Ответ должен быть близок к сорока пяти тысячам.`;
  ikkinchi xatoda `43 500` qatori va uning ikki xona siljishi ko'rsatiladi.

### 12-slayd — Eng qulay strategiya

- **Turi:** strategy choice, scored.
- **V-UZ:** `398 × 201 uchun eng qisqa ishonchli usul qaysi?`
- **V-RU:** `Какой способ самый короткий и надёжный для 398 × 201?`
- **Variantlar:** `398 × 200 + 398` — to'g'ri; `400 × 201`;
  `398 + 201`.
- **A-UZ:** `Ikki yuz bir soni ikki yuz va birdan tuzilgan.` |
  `Uch yuz to'qson sakkizni ikki yuzga va birga alohida ko'paytirish qulay.` |
  `Eng qisqa aniq usulni tanlang.`
- **A-RU:** `Число двести один состоит из двухсот и одного.` |
  `Удобно отдельно умножить триста девяносто восемь на двести и на один.` |
  `Выбери самый короткий точный способ.`
- **Avtomatik isbot:** `398 × 200 = 79 600`; `398 × 1 = 398`;
  `79 600 + 398 = 79 998`; natija `80 000` taxminidan `2` kichik.
- **Feedback:** `400 × 201` uchun:
  `Bu tayanchdan aniq javob olish uchun 2 × 201, ya'ni 402 ni ayirish kerak. Shunda 80 400 − 402 = 79 998 bo'ladi.` /
  `Чтобы получить точный ответ от этой опоры, нужно вычесть 2 × 201, то есть 402. Тогда 80 400 − 402 = 79 998.`;
  qo'shish uchun: `Qo'shish 201 ta teng guruhni ifodalamaydi.` /
  `Сложение не показывает 201 равную группу.`
- **Taxmin izohi:** `80 000 taxmini boshqa soddalashtirishdan, 400 × 200 dan olinadi; u aniq hisob emas.` /
  `Оценка 80 000 получается из другого упрощения, 400 × 200; это не точное вычисление.`

### 13-slayd — Yuzlik qatori xatosini tuzatish

- **Turi:** error repair, scored.
- **V-UZ:** Bit yozuvi `213 × 103`; qatorlar `639`, `0`, `2 130`;
  xato natija `2 769`; savol: `Qaysi qatorni tuzatish kerak?`
- **V-RU:** `Какую строку нужно исправить?`
- **Variantlar:** `21 300` — to'g'ri replacement; `213`; `213 000`.
- **A-UZ:** `Bit ikki yuz o'n uchni bir yuz uchga ko'paytirdi.` |
  `U yuzlik raqamini o'nlik deb joylashtirdi.` |
  `Noto'g'ri qator o'rniga mos qiymatni tanlang.`
- **A-RU:** `Бит умножал двести тринадцать на сто три.` |
  `Он разместил цифру сотен как цифру десятков.` |
  `Выбери правильное значение вместо неверной строки.`
- **Mikroanimatsiya:** `2 130` yana bir xona chapga siljib `21 300`
  bo'ladi; yangi yig'indi `21 939` tushadi.
- **Feedback:** `213` uchun:
  `Bu bir birlikka ko'paytma; 1 bu yerda yuzni bildiradi.` /
  `Это произведение на одну единицу; здесь 1 означает сто.`;
  `213 000` uchun: `Yuzliklar qatori uch emas, ikki xona siljiydi.` /
  `Строка сотен сдвигается на два разряда, а не на три.`

### 14-slayd — Shahar bloklari

- **Turi:** transfer case, scored.
- **V-UZ:** `203 ta blokning har birida 124 ta ulanish bor. Qaysi hisob rejasi to'g'ri?`
- **V-RU:** `В каждом из 203 блоков по 124 соединения. Какой план вычисления верен?`
- **Variantlar:**
  - `124 × 200 = 24 800 va 124 × 3 = 372` — to'g'ri;
  - `124 × 20 = 2 480 va 124 × 3 = 372`;
  - `124 × 200 = 24 800 va 124 × 30 = 3 720`.
- **A-UZ:** `Ikki yuz uchta blokning har birida bir yuz yigirma to'rtta ulanish bor.` |
  `Ikki yuz uch sonidagi nol o'nliklar xonasini saqlaydi.` |
  `To'g'ri hisob rejasini tanlang.`
- **A-RU:** `В каждом из двухсот трёх блоков находится сто двадцать четыре соединения.` |
  `Ноль в числе двести три сохраняет разряд десятков.` |
  `Выбери верный план вычисления.`
- **Mikroanimatsiya:** `24 800` va `372` xona bo'yicha tekislanadi;
  `25 172` natija tushadi; ulanish chiziqlari yonadi.
- **Feedback:** `124 × 20` uchun:
  `2 o'nlar emas, yuzlar xonasida; u 200 ni bildiradi.` /
  `Цифра 2 стоит в сотнях и означает 200.`;
  `124 × 30` uchun: `Ko'paytiruvchining o'nlar raqami nol; 30 ga ko'paytma kerak emas.` /
  `Цифра десятков равна нулю; произведение на 30 не нужно.`

### 15-slayd — Avtomatik xulosa

- **Turi:** summary, majburiy refleksiya yo'q.
- **V-UZ:** `Birliklar qatori — 0 xona`; `O'nliklar qatori — 1 xona`;
  `Yuzliklar qatori — 2 xona`; `Nol xona o'rnini saqlaydi`;
  `Qatorlarni qo'shing va taxmin bilan tekshiring`.
- **V-RU:** `Строка единиц — 0 разрядов`; `Строка десятков — 1 разряд`;
  `Строка сотен — 2 разряда`; `Ноль сохраняет место разряда`;
  `Сложи строки и проверь результат оценкой`.
- **A-UZ:** `Uch xonali ko'paytiruvchi yuzliklar, o'nliklar va birliklarga ajraladi.` |
  `Birliklar qatori siljimaydi.` |
  `O'nliklar qatori bir xona, yuzliklar qatori ikki xona chapdan boshlanadi.` |
  `Nol tegishli xona o'rnini saqlaydi.` |
  `Qatorlar qo'shiladi va natija taxmin bilan tekshiriladi.`
- **A-RU:** `Трёхзначный множитель раскладывается на сотни, десятки и единицы.` |
  `Строка единиц не сдвигается.` |
  `Строка десятков начинается на один, а строка сотен на два разряда левее.` |
  `Ноль сохраняет место соответствующего разряда.` |
  `Строки складываются, а результат проверяется оценкой.`
- **Mikroanimatsiya:** hookdagi uch diapazon qaytadi; replay xom `944`, `236`,
  `708` qatorlaridan boshlanadi. `236` bir marta, `708` ikki xona siljib,
  `2 360` va `70 800`ga aylanadi. Tayyor qiymatlar qayta siljitilmaydi; ular
  vertikal tekislanib `74 104`ni beradi va to'g'ri diapazon yonadi.
  Happy Bit, medal va ko'prik:
  `Keyingi mavzu: ko'paytirishga teskari amal bo'lgan bo'lish.` /
  `Следующая тема: деление, обратное действие для умножения.`

---

# Yakuniy qabul mezonlari

## Strukturaviy tekshiruv

- Har bir darsda aynan 15 ta slayd; jami 75 ta slayd.
- Har darsda 1 ta hook, 7 ta tushuntirish/kashfiyot, 6 ta turli mashq va
  1 ta avtomatik yakun bor.
- Hech bir slaydda `QADAM 1/7`, frame nuqtalari yoki ichki `Keyingi qadam` yo'q.
- Tushuntirish slaydlaridagi matematik o'zgarishlar audio bilan avtomatik ketadi.
- Mashq ekranida faqat bitta markaziy vazifa bor; matching yoki construction
  bitta yaxlit maydon sifatida ochiladi.
- Bit faqat tayyor 4-sinf etalon assetidan olinadi; yangi robot chizilmaydi.
- Sahifa full-page; barcha kontentni qamrab oluvchi tashqi card yo'q.

## Metodik tekshiruv

- 7-darsda Rim yozuvi 20 dan oshmaydi va faqat 2–3-slaydlarda o'rgatiladi;
  4–8-slaydlarda asosiy mavzu — pozitsion va nopozitsion tizimlar.
- 8-darsda tekislash, qo'shishdagi yiriklashtirish, ayirishdagi maydalash,
  nol zanjiri, taxmin va teskari amal alohida ma'no bilan ko'rsatiladi.
- 9-darsda ko'paytirish teng guruhlar va xona qiymatidan ustun algoritmiga o'tadi.
- 10-darsda `23 = 20 + 3` ikki qatorning sababi bo'ladi; siljish yodlash uchun
  emas, o'nlik qiymatining natijasi sifatida ko'rsatiladi.
- 11-darsda 10-dars modeli 0, 1 va 2 xona siljishiga kengayadi; o'rtadagi nol
  yo'qolmaydi.
- Har bir noto'g'ri variantga aynan o'sha misconceptionni tuzatadigan feedback bor.

## Texnik va accessibility tekshiruv

- UZ va RU ekran matni, audio va feedback bir xil matematik ma'noga ega.
- Audio segmenti bitta fikrni beradi; ramz va formulalar audioda so'z bilan aytiladi.
- Audio o'chirilganda captionlar butun tushuntirishni saqlaydi.
- Reduced motion yakuniy matematik holatni saqlaydi.
- Drag vazifalarida tap muqobili; barcha targetlar kamida `44 × 44` piksel.
- `390px` va `936px` viewportda xona ustunlari buzilmaydi va gorizontal scroll yo'q.
- O'zbekcha `to'liqsiz ko'paytma`, `ko'chirish`, `maydalash` va sanoq sistemalari
  terminlari kontent tasdiqlanishidan oldin o'zbek matematika metodisti tomonidan
  yakuniy validatsiya qilinadi.

## Deterministik matematik tekshiruv

Rejadagi asosiy natijalar lokal `math-tools` orqali qayta hisoblandi:

- 8-dars: `48 392 + 7 605 = 55 997`;
  noto'g'ri chap tekislashning xona talqini `48 392 + 76 050 = 124 442`;
  `28 467 + 15 785 = 44 252`; `63 241 − 27 856 = 35 385`;
  `40 005 − 17 268 = 22 737`; `60 002 − 24 785 = 35 217`;
  `72 000 − 18 756 = 53 244`.
- 9-dars: `2 408 × 3 = 7 224`; `3 746 × 4 = 14 984`;
  `124 × 6 = 744`; `4 052 × 6 = 24 312`; `4 999 × 7 = 34 993`;
  `5 847 × 3 = 17 541`; `3 017 × 5 = 15 085`; `2 375 × 6 = 14 250`.
- 10-dars: `324 × 23 = 7 452`; `246 × 14 = 3 444`;
  `1 205 × 30 = 36 150`; `417 × 32 = 13 344`;
  `213 × 12 = 2 556`; `128 × 24 = 3 072`.
- 11-dars: `236 × 314 = 74 104`; `132 × 204 = 26 928`;
  `145 × 326 = 47 270`; `398 × 201 = 79 998`;
  `213 × 103 = 21 939`; `124 × 203 = 25 172`.
