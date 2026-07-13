# Dars01 — SKELETON (content-generator kontrakti) · num-2-01

> Manba: `2sinf_metodologiya.md` §6.1 (budjet) + §6.2 (tushuntir+qoida) · `ETALON_2SINF.md` ·
> `SYUJET_2SINF.md` v2 (🪐 Sayyora 1 «Energiya»). Struktura tasdiqlangan (metodist 2026-07-13).
> Bu — skeleton (metodik qaror); matn/audio — content-generator.

## Ramka (SYUJET v2)
- **Dunyo:** 🪐 Energiya sayyorasi — Bit va ekipaj (Ra'no/Anvar/Zuhra/Jasur, yangi sayohat kiyimida)
  uyga qaytmoqda; kema yoqilg'isiz qo'ngan. Dvigatel yoqilg'ini **faqat o'ntadan (kassetada)** oladi.
- **Rekvizit:** batareya = birlik; kasseta = 10 batareya = o'nlik; neon-displey, kod-panel, yuk xati, raketa.
- **Yopiq sikl:** hook = ucholmaydi (to'siq) → yakun = yoqilg'i to'g'ri yig'ildi, raketa uchdi, **1-sayyora ortda, uyga yaqin**.
- **Bit:** sayohatchi + diktor (ayol ovoz). Yo'l xaritasi (6 sayyora→Yer) progress sifatida.

## Yadro matematika
10 birlik = 1 o'nlik; ikki xonali sonda chap raqam — o'nliklar, o'ng — birliklar; 45 = 4 o'nlik 5 birlik.

## §6.2 TUSHUNTIR + QOIDA (har ekranga majburiy)
- Har ochilish (s2–s6): "bola qiladi" + **Bit ravshan tushuntiradi NIMA va NEGA** (ovoz yetakchi); qisqa yozma tayanch ekranda.
- **QOIDA kartasi (s7):** darsning asosiy tushuntirish momenti — rang-kodli, qonun sifatida, ovozda + ekranda yozma.
- Qoida sikli: hook(jumboq) → ochilishda quriladi → s7 QOIDA → **s15 recap**.
- O'yin tushuntirishga xizmat qiladi, o'rnini bosmaydi.

## Misconception xaritasi
- M1 (45↔54 o'rin almashish): s5(faol), s11, s13(36), s14(74).
- M2 (o'nlik+birlik qo'shish, 34=3+4=7): s7(himoya), s10(7), s13(9), s14(11).
- M3 (raqamni so'zma-so'z: 502/407): s10(502), s14(407).
- M4 (kasseta↔batareya = o'nlik↔birlik): s2, s9.

```json
{
  "lesson_id": "num-2-01",
  "topic": "O'nliklar va birliklar (100 gacha razryad)",
  "grade": 2, "block": "Б1",
  "world": "SYUJET_2SINF v2 · Sayyora 1 «Energiya» (Bit+ekipaj uyga qaytadi; yoqilg'i o'ntalab)",
  "approach": "concrete-avval unitizing (batareya=birlik/kasseta=o'nlik) -> razryad kartasi -> son o'qi; ochiq tushuntirish + ko'rinadigan QOIDA; typingsiz tap/drag",
  "voice": "ayol (g=f)",
  "screens_count": 16,
  "screens": [
    { "id": "s0", "number_in_lesson": 1, "type": "hook", "subtype": null, "template": "MCScreen", "scored": false, "scope": "hook",
      "topic": "Qo'nish: kema yoqilg'isiz; dvigatel yoqilg'ini faqat o'ntadan oladi",
      "goal": "Ko'rinadigan to'siq/maqsad: sochilgan yoqilg'ini tez tayyorlash; mavzuni ochiq e'lon qilish (Tema: O'nliklar va birliklar)",
      "visual_brief": "Energiya sayyorasi qo'nish maydoni; batareyalar sochilgan; Bit+ekipaj (yangi kiyim). Mavzu chipi. To'g'ri tanlovga yashil 'to'g'ri' chiqmaydi.",
      "interactive_brief": "3 tanlov (bittalab / o'ntadan kassetaga / bilmayman); istalgan tanlovdan keyin yumshoq on_wrong/on_unknown, keyin Davom.",
      "audio_brief": "Bit: mavzuni e'lon qiladi + muammoni tushuntiradi (kema ucholmaydi, dvigatel o'ntadan oladi). Bir necha qisqa segment, TTS-toza.",
      "teaching": "mavzu ochiq nomlanadi; muammo tushuntiriladi", "misconceptions": null, "reset_on_return": true },

    { "id": "s1", "number_in_lesson": 2, "type": "test", "subtype": "choice", "template": "MCScreen", "scored": false, "scope": null,
      "topic": "Prerekvizit-recall: 10 birlik = 1 o'nlik (1-sinf)",
      "goal": "O'tgan bilimni spaced-retrieval bilan faollashtirish (ballsiz)",
      "visual_brief": "Kichik figura: 10 birlik-element -> 1 blok. Qisqa mikro-savol.",
      "interactive_brief": "3 tanlovli MC; to'g'ri — 'bitta o'nlik'.",
      "audio_brief": "Bit: qisqa recall-savoli + nega muhimligini bir jumla bilan.",
      "teaching": "o'tgan qoidani eslatadi", "misconceptions": [
        { "option_idx": 1, "label": "O'nta o'nlik", "explain": "10 birlik yig'ilsa bitta o'nlik bo'ladi, o'nta emas." },
        { "option_idx": 2, "label": "Bir birlik", "explain": "10 birlik birga bitta o'nlik dastasi bo'ladi." } ], "reset_on_return": false },

    { "id": "s2", "number_in_lesson": 3, "type": "exploration", "subtype": "build", "template": "custom", "scored": false, "scope": null,
      "topic": "UNITIZING: 10 batareya -> 1 kasseta (o'nlik) [tasvir-1]",
      "goal": "Asosiy g'oyani faol ochish + tushuntirish: bola 10 batareyani yig'adi, Bit 'o'nlik' nima ekanini aytadi",
      "visual_brief": "10 suzuvchi batareya; slot to'ladi; 10 da kasseta yopiladi, LED yonadi. 10 batareya = 1 kasseta.",
      "interactive_brief": "Tap-to-move; 10 da avtomatik yopilish + done.",
      "audio_brief": "Bit TUSHUNTIRADI: bittalab sanash uzoq (NEGA) -> o'ntalab yig'amiz (NIMA) -> 'o'nlik' so'zi. Sonlar so'z bilan.",
      "teaching": "yozma tayanch: '10 birlik = 1 o'nlik'", "misconceptions": null, "reset_on_return": false },

    { "id": "s3", "number_in_lesson": 4, "type": "exploration", "subtype": "build", "template": "custom", "scored": false, "scope": null,
      "topic": "Ikki xonali sonni yig'ish: 24 = 2 o'nlik + 4 birlik",
      "goal": "O'nlik+birlik birga sonni hosil qilishini faol ko'rsatish + tushuntirish",
      "visual_brief": "Pult: kasseta tugmasi (o'nlik) + batareya tugmasi (birlik); razryad jadvali + katta son-displey.",
      "interactive_brief": "Avval 2 kasseta (o'nlik), keyin 4 batareya (birlik) -> 24.",
      "audio_brief": "Bit: 2 o'nlik = yigirma (NEGA); 4 birlik qo'shildi; jami nechta — o'zing sana.",
      "teaching": "yozma tayanch: son = o'nlik + birlik", "misconceptions": null, "reset_on_return": false },

    { "id": "s4", "number_in_lesson": 5, "type": "exploration", "subtype": "step-by-step", "template": "custom", "scored": false, "scope": null,
      "topic": "RAZRYAD KARTASI: 34 -> o'nlik|birlik; 34 = 30 + 4 [tasvir-2]",
      "goal": "Sonni razryad kartasi bilan ochish va TUSHUNTIRISH: chap ustun o'nlik, o'ng birlik; yoyma 34=30+4 (yozma anchor)",
      "visual_brief": "Ikki ustunli razryad kartasi (o'nliklar|birliklar) 3|4; ovoz bilan ustun yonadi; ekranda yozma: 34 = 30 + 4.",
      "interactive_brief": "Bola qadamlarni suradi (avto-reveal EMAS).",
      "audio_brief": "Bit TUSHUNTIRADI: chap xona o'nliklar (3 kasseta = 30), o'ng xona birliklar (4); birga 34.",
      "teaching": "yozma anchor: 34 = 30 + 4; chap=o'nlik, o'ng=birlik", "misconceptions": null, "reset_on_return": false },

    { "id": "s5", "number_in_lesson": 6, "type": "exploration", "subtype": "build", "template": "custom", "scored": false, "scope": null,
      "topic": "O'RIN HAL QILADI: 45 va 54 (bir xil raqam, boshqa o'rin)",
      "goal": "M1 ni faol kashf qilish + tushuntirish: o'rin sonni belgilaydi",
      "visual_brief": "Lyuk-kod paneli: o'nlik|birlik kataklari; bola raqamni to'g'ri o'ringa qo'yadi, lyuk ochiladi; ikki kod (45, 54) yonma-yon.",
      "interactive_brief": "Raqamni o'nlik/birlik xonasiga bosib joylash; xato o'rin -> ochilmaydi + hint, qayta.",
      "audio_brief": "Bit: kod to'rt o'nlik besh birlik; o'rni almashdi; NEGA kodlar har xil — o'rin sonni belgilaydi.",
      "teaching": "yozma tayanch: 45 va 54 — o'rin farqi", "misconceptions": null, "reset_on_return": false },

    { "id": "s6", "number_in_lesson": 7, "type": "exploration", "subtype": "step-by-step", "template": "custom", "scored": false, "scope": null,
      "topic": "SON O'QI: 34 qayerda (o'nlik = katta sakrash, birlik = kichik qadam) [tasvir-3]",
      "goal": "34 ni son o'qida joylashtirish + o'nlik/birlik masshtab farqini tushuntirish",
      "visual_brief": "0..40 son o'qi; 3 katta sakrash (o'nlik) 30 gacha + 4 kichik qadam (birlik) 34 gacha; 34 markeri.",
      "interactive_brief": "Bola sakrashlarni ketma-ket suradi.",
      "audio_brief": "Bit: uch marta o'ntadan sakrab o'ttizgacha, yana to'rt kichik qadam o'ttiz to'rtgacha.",
      "teaching": "o'nlik va birlik son o'qida ham ko'rinadi", "misconceptions": null, "reset_on_return": false },

    { "id": "s7", "number_in_lesson": 8, "type": "rule", "subtype": null, "template": "custom", "scored": false, "scope": null,
      "topic": "QOIDA/QONUN: chap raqam=o'nlik, o'ng=birlik; 34 != 3 + 4; hookga qaytish",
      "goal": "DARSNING ASOSIY TUSHUNTIRISH MOMENTI — qoidani ravshan yozma karta + ovoz bilan rasmiylashtirish; yonma-yon != qo'shish; hook maqsadiga bog'lash",
      "visual_brief": "Rang-kodli QOIDA kartasi (o'nlik aksent, birlik ko'k) — ekranda yozma qonun jumlasi + 45 misoli; faol farqlash-cheki (bola o'nlik raqamini bosadi).",
      "interactive_brief": "Bola yangi sonda o'nlik raqamini bosib qoidani tekshiradi.",
      "audio_brief": "Bit: eng muhim qoida — chap doim o'nlik, o'ng doim birlik; 3 va 4 ni qo'shsak 7, yonma-yon qo'ysak 34 (qo'shish emas). Sekin, ta'kidlab.",
      "teaching": "KO'RINADIGAN QOIDA KARTASI (qonun) — ovoz + yozma", "misconceptions": null, "reset_on_return": false },

    { "id": "s8", "number_in_lesson": 9, "type": "test", "subtype": "build", "template": "custom", "scored": true, "scope": "module-mikro",
      "topic": "Mashq: 45 ni yig'ish (o'nlik/birlik plita + Tekshirish)",
      "goal": "O'nlik va birlikdan sonni mustaqil qurishni tekshirish",
      "visual_brief": "Pult: o'nlik +/- va birlik +/- plitalari; katta son-displey; alohida Tekshirish tugmasi.",
      "interactive_brief": "4 o'nlik + 5 birlik yig'ib Tekshirish; xatoda usul-hint (sonsiz), веди-до-верного.",
      "audio_brief": "intro: 45 ni yig'; on_correct/on_wrong pushOneOff (on_wrong'da yakuniy son YO'Q, faqat usul).",
      "teaching": "veди-до-верного razbor usulni tushuntiradi", "misconceptions": [
        { "option_idx": null, "label": "Xona almashtirish (54)", "explain": "Avval o'nliklarni, keyin birliklarni yig'; chap xona o'nlik." },
        { "option_idx": null, "label": "Bitta xonani yig'ish", "explain": "O'nlik va birlik birga 45 beradi." } ], "reset_on_return": false },

    { "id": "s9", "number_in_lesson": 10, "type": "test", "subtype": "sort", "template": "custom", "scored": true, "scope": "module-mikro",
      "topic": "Tasniflash: kasseta->O'NLIKLAR, batareya->BIRLIKLAR",
      "goal": "M4 ni tekshirish: kasseta = o'nlik, yakka batareya = birlik",
      "visual_brief": "Aralash yuk (3 kasseta + 2 batareya) + ikki tryum (O'NLIKLAR / BIRLIKLAR).",
      "interactive_brief": "Tap-to-bin; xato tryum -> qaytadi + voiced hint.",
      "audio_brief": "intro: kassetalar bir tomonga, batareyalar boshqa; on_wrong usulni tushuntiradi.",
      "teaching": "on_wrong: nega kasseta o'nlik", "misconceptions": [
        { "option_idx": null, "label": "Kassetani birliklarga", "explain": "Kasseta ichida o'nta batareya — demak o'nlik." },
        { "option_idx": null, "label": "Batareyani o'nliklarga", "explain": "Yolg'iz batareya — bitta birlik." } ], "reset_on_return": false },

    { "id": "s10", "number_in_lesson": 11, "type": "test", "subtype": "choice", "template": "MCScreen", "scored": true, "scope": "module-mikro",
      "topic": "Besh o'nlik va ikki birlik — qaysi son? (52)",
      "goal": "Razryad tarkibidan songa o'tishni tekshirish (M2, M3)",
      "visual_brief": "Kichik figura: 5 kasseta + 2 batareya.",
      "interactive_brief": "4 sonli MC (shuffleMC), to'g'ri — 52.",
      "audio_brief": "intro savolni takrorlaydi; on_correct/on_wrong.",
      "teaching": "har xato razryad usulini tushuntiradi", "misconceptions": [
        { "option_idx": 0, "label": "25 (o'rin almashgan)", "explain": "Bu yerda ikki o'nlik besh birlik — o'rnini almashtir." },
        { "option_idx": 2, "label": "7 (qo'shgan)", "explain": "Yetti — qo'shsak; o'nlik va birlik alohida turadi." },
        { "option_idx": 3, "label": "502 (so'zma-so'z)", "explain": "Besh o'nlik = 50, unga ikki; 502 emas." } ], "reset_on_return": false },

    { "id": "s11", "number_in_lesson": 12, "type": "test", "subtype": "choice", "template": "MCScreen", "scored": true, "scope": "module-mikro",
      "topic": "Taqqoslash: qaysi kemada yoqilg'i ko'p — 45 yoki 54?",
      "goal": "Taqqoslashda avval o'nlikni solishtirishni tekshirish (M1)",
      "visual_brief": "Ikki tank/kema (kod 45 va 54) + yuk (kasseta/batareya).",
      "interactive_brief": "2 tanlovli MC; to'g'ri — 54.",
      "audio_brief": "intro: avval o'nliklarni solishtir; on_correct: besh o'nlik to'rt o'nlikdan katta.",
      "teaching": "taqqoslash usuli: avval o'nlik", "misconceptions": [
        { "option_idx": 0, "label": "45 (birlikka qaragan)", "explain": "Avval o'nliklarni solishtir: kimda kasseta ko'p." } ], "reset_on_return": false },

    { "id": "s12", "number_in_lesson": 13, "type": "case", "subtype": "setup", "template": "custom", "scored": false, "scope": null,
      "topic": "Yuk xati: 6 kasseta + 3 batareya (kontekst) — ekipajdan bir hamroh bilan",
      "goal": "Hayotiy masala konteksti; o'nlik/birlik guruhlarini ko'rsatish",
      "visual_brief": "Yuk-xati (manifest) + ikki guruh: 6 kasseta, 3 batareya (rack). Ekipajdan bir do'st (masala qahramoni). Keep-visible.",
      "interactive_brief": "Interaktiv yo'q; audio kirish -> savol ekraniga.",
      "audio_brief": "Bit/hamroh: olti kasseta o'ntadan = olti o'nlik; uch batareya = uch birlik.",
      "teaching": "guruhlarni o'nlik/birlik deb tushuntiradi", "misconceptions": null, "reset_on_return": false },

    { "id": "s13", "number_in_lesson": 14, "type": "case", "subtype": "step", "template": "MCScreen", "scored": true, "scope": "module-mikro",
      "topic": "Jami nechta? (63)",
      "goal": "Razryad guruhlaridan sonni hisoblash (M1, M2)",
      "visual_brief": "s12 konteksti tepada qoladi; pastda sonli MC.",
      "interactive_brief": "4 sonli MC (shuffleMC), to'g'ri — 63.",
      "audio_brief": "intro: kassetalar o'nlik, batareyalar birlik; on_correct: olti o'nlik uch birlik — oltmish uch.",
      "teaching": "har xato usulni tushuntiradi", "misconceptions": [
        { "option_idx": 1, "label": "36 (o'rin almashgan)", "explain": "Kassetalar oltita — o'nliklar, chapga; o'rnini almashtirma." },
        { "option_idx": 2, "label": "9 (qo'shgan)", "explain": "To'qqiz — qo'shsak; kassetalarda o'ntadan." },
        { "option_idx": 3, "label": "60 (birlikni unutgan)", "explain": "Uchta alohida batareyani ham qo'sh." } ], "reset_on_return": false },

    { "id": "s14", "number_in_lesson": 15, "type": "test", "subtype": "choice", "template": "MCScreen", "scored": true, "scope": "final",
      "topic": "FINAL: displey 4 kasseta + 7 batareya -> qaysi son? (47) + FactCard",
      "goal": "Yakuniy razryad->son tekshiruvi; to'g'rida qiziqarli fakt (raketa teskari-sanash)",
      "visual_brief": "Devor-tablo: 4 kasseta + 7 batareya; to'g'rida FactCard (raketa 10-9-8) javob zonasida (skrollsiz).",
      "interactive_brief": "4 sonli MC (shuffleMC), to'g'ri — 47; factOnCorrect ko'rinadi va qoladi.",
      "audio_brief": "intro: sonni yig'; on_correct + fact_audio (TTS-toza).",
      "teaching": "yakuniy tekshiruv", "misconceptions": [
        { "option_idx": 1, "label": "74 (o'rin almashgan)", "explain": "Kasseta to'rtta — o'nliklar, chapda." },
        { "option_idx": 2, "label": "11 (qo'shgan)", "explain": "O'n bir — qo'shsak; yonma-yon yoziladi." },
        { "option_idx": 3, "label": "407 (so'zma-so'z)", "explain": "To'rt o'nlik = 40, unga yetti; 407 emas." } ], "reset_on_return": false },

    { "id": "s15", "number_in_lesson": 16, "type": "summary", "subtype": null, "template": "custom", "scored": false, "scope": "final",
      "topic": "Yakun: raketa uchdi (1-sayyora ortda, uyga yaqin) + QOIDA RECAP + ConnectionsBlock",
      "goal": "Missiyani yopish; QOIDANI QAYTA AYTISH (recap); yo'l xaritasida keyingi nuqta; keyingi darsga ko'prik",
      "visual_brief": "Bayram (uchish/warp + Bit+ekipaj); can-do qatori; QOIDA recap ('chap=o'nlik, o'ng=birlik'); yo'l xaritasi (1/6). Son ko'rsatilmaydi.",
      "interactive_brief": "Tugatish tugmasi -> finishLesson payload.",
      "audio_brief": "Bit: missiya bajarildi; 10 birlik = 1 o'nlik; chap o'nlik, o'ng birlik (RECAP); keyingi sayyora anonsi.",
      "teaching": "QOIDA recap (sikl yopiladi)", "misconceptions": null, "reset_on_return": false }
  ]
}
```
