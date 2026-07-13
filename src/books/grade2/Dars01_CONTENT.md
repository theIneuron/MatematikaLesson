# Dars01 «O'nliklar va birliklar» — CONTENT (RU + UZ + audio) · **rebuild «Bit uyga qaytadi»**

> Pipeline [2] content. Skeleton: `Dars01_SKELETON.md` (16 ekran). Dunyo: `SYUJET_2SINF.md`
> v2 — 🪐 Sayyora 1 «Energiya»; Bit va ekipaj (Ra'no/Anvar/Zuhra/Jasur, sayohat kiyimida)
> uyga qaytmoqda; kema qo'nib yoqilg'isiz qoldi, dvigatel yoqilg'ini faqat o'ntadan
> (kassetada) oladi. Rekvizit: batareya (birlik), kasseta = 10 batareya (o'nlik).
> Ovoz: ayol (g=f), Bit — sayohatchi + diktor.
>
> **§6.2.5 tushuntir+qoida:** har ekran Bit NIMA va NEGA ni ochiq aytadi; s7 = ko'rinadigan
> QOIDA kartasi; s15 = QOIDA recap. Audio **TTS-toza**: sonlar so'z bilan, belgi/«»/uzun tire/
> ikki-nuqta-ro'yxat YO'Q, bir segment = bir fikr; ovozlanadigan xato-hint yakuniy sonni
> bermaydi. Register: RU `ты`, UZ `siz`, SOV, oddiy `'`, toza lotin. Barcha son 100 ichida.
>
> jsx-builder kontrakti — quyidagi `CONTENT` obyekti to'g'ridan-to'g'ri joylashtiriladi.

```javascript
const CONTENT = {
  // s0 — HOOK (scope: hook): sayyoraga qo'nish, ucholmaydi, o'ntadan yoqilg'i
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Десятки и единицы', uz: "Mavzu: O'nliklar va birliklar" },
    lead: { ru: 'Бит не может взлететь!', uz: 'Bit ucha olmayapti!' },
    q: { ru: 'Как быстро подготовить топливо?', uz: "Yoqilg'ini qanday tez tayyorlaymiz?" },
    opt0: { ru: 'По одной', uz: 'Bittalab' },
    opt1: { ru: 'По десять в кассету', uz: "O'ntadan kassetaga" },   // yetakchi (correct-key)
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Сегодня тема урока — десятки и единицы. Научимся видеть, сколько в числе десятков и сколько единиц.',
          'Бит и друзья возвращаются домой. Их корабль сел на планету и остался без топлива.',
          'Двигатель берёт топливо только десятками. А батарейки рассыпались по площадке.',
          'Поможем Биту собрать их по десять, и корабль полетит дальше, к дому.'
        ],
        uz: [
          "Bugungi dars mavzusi — o'nliklar va birliklar. Sonda nechta o'nlik va nechta birlik borligini ko'rishni o'rganamiz.",
          "Bit va do'stlar uyga qaytmoqda. Kemasi sayyoraga qo'nib, yoqilg'isiz qoldi.",
          "Dvigatel yoqilg'ini faqat o'ntadan oladi. Batareyalar esa maydonga sochilib ketdi.",
          "Bitga ularni o'ntadan yig'ishga yordam beramiz, va kema uyga tomon uchadi."
        ]
      },
      on_correct: { ru: 'Отличная мысль. Соберём по десять, и станет видно.', uz: "Zo'r fikr. O'ntadan yig'amiz, va ko'rinadi." },
      on_wrong: { ru: 'Так можно, но это долго. На корабле есть способ быстрее.', uz: "Bunday bo'ladi, lekin uzoq. Kemada tezroq yo'l bor." },
      on_unknown: { ru: 'Ничего. Сейчас увидим способ корабля.', uz: "Hechqisi yo'q. Hozir kemaning yo'lini ko'ramiz." }
    }
  },

  // s1 — PREREKVIZIT-RECALL (ballsiz): 10 birlik = 1 o'nlik
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz' },
    lead: { ru: 'Проверь себя.', uz: "O'zingizni sinang." },
    q: { ru: 'Сколько единиц нужно, чтобы получился один десяток?', uz: "Bitta o'nlik hosil bo'lishi uchun nechta birlik kerak?" },
    opt0: { ru: 'Десять', uz: "O'n" },   // correct (idx 0)
    opt1: { ru: 'Один', uz: 'Bir' },
    opt2: { ru: 'Сто', uz: 'Yuz' },
    wrong_1: { ru: 'Один — это одна батарейка. А в десяток их собирается больше.', uz: "Bir — bitta batareya. O'nlikka esa ko'proq yig'iladi." },
    wrong_2: { ru: 'Сто — это очень много. Десяток собирается из меньшего числа.', uz: "Yuz — juda ko'p. O'nlik kamroq sondan yig'iladi." },
    audio: {
      intro: { ru: 'Вспомним прошлый год. Десяток собирается из отдельных единиц.', uz: "O'tgan yilni eslaymiz. O'nlik alohida birliklardan yig'iladi." },
      on_correct: { ru: 'Верно. Десять единиц — это один десяток.', uz: "To'g'ri. O'n birlik — bitta o'nlik." },
      on_wrong: { ru: 'Их ровно десять. Посчитай ещё раз.', uz: "Ular roppa-rosa o'nta. Yana bir sanang." }
    }
  },

  // s2 — OCHILISH-1 (unitizing): 10 batareya -> 1 kasseta
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Уложи батарейки в кассету.', uz: 'Batareyalarni kassetaga joylang.' },
    done_text: { ru: 'Одна кассета — это один десяток. Теперь считать удобно.', uz: "Bitta kasseta — bu bitta o'nlik. Endi sanash qulay." },
    audio: {
      ru: [
        'Смотри. Считать батарейки по одной долго, и легко ошибиться. Поэтому придумали удобный способ, собирать их по десять. Переноси батарейки в кассету.',
        'Когда батареек станет ровно десять, кассета закроется, и загорится огонёк.',
        'Вот. Десять батареек стали одной кассетой. Одну такую кассету мы называем десяток. Запомни это слово. Десяток это десять вместе.'
      ],
      uz: [
        "Qarang. Batareyalarni bittalab sanash uzoq, oson adashiladi. Shuning uchun qulay yo'l o'ylab topilgan, ularni o'ntalab yig'ish. Batareyalarni kassetaga o'tkazing.",
        "Batareyalar roppa-rosa o'nta bo'lganda kasseta yopiladi, va chiroq yonadi.",
        "Mana. O'nta batareya bitta kasseta bo'ldi. Bitta shunday kassetani o'nlik deymiz. Shu so'zni yodda tuting. O'nlik bu o'nta birga."
      ]
    }
  },

  // s3 — OCHILISH-2: 24 ni yig'ish
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Собери 24.', uz: "24 ni yig'ing." },
    src_tens: { ru: 'кассета +', uz: 'kasseta +' },
    src_ones: { ru: 'батарейка +', uz: 'batareya +' },
    tens_label: { ru: 'десятки', uz: "o'nliklar" },
    ones_label: { ru: 'единицы', uz: 'birliklar' },
    done_text: { ru: 'Два десятка и четыре единицы — двадцать четыре.', uz: "Ikki o'nlik va to'rt birlik — yigirma to'rt." },
    audio: {
      ru: [
        'Теперь соберём число сами. Возьми две кассеты. В каждой по десять, значит вместе это два десятка, двадцать.',
        'Добавь четыре отдельные батарейки. Их не хватило, чтобы собрать ещё один десяток, поэтому они остаются единицами.',
        'Посмотри на табло и сосчитай сам. Сколько всего получилось?'
      ],
      uz: [
        "Endi sonni o'zimiz yig'amiz. Ikkita kasseta oling. Har birida o'ntadan, demak birga bu ikki o'nlik, yigirma.",
        "To'rtta alohida batareya qo'shing. Ular yana bir o'nlik yig'ishga yetmadi, shuning uchun birlik bo'lib qoladi.",
        "Displeyga qarang, va o'zingiz sanang. Jami nechta bo'ldi?"
      ]
    }
  },

  // s4 — OCHILISH-3 (razryad kartasi): 34 -> o'nlik|birlik; 34 = 30 + 4
  s4: {
    eyebrow: { ru: 'Разбор числа', uz: 'Sonni ochamiz' },
    lead: { ru: 'Разложим число 34.', uz: "34 ni ochamiz." },
    tens_label: { ru: 'десятки', uz: "o'nliklar" },
    ones_label: { ru: 'единицы', uz: 'birliklar' },
    // ekranda yozma anchor: 34 = 30 + 4
    audio: {
      ru: [
        'Разберём число тридцать четыре. У каждого числа есть два места, два разряда. Слева десятки, справа единицы.',
        'Слева три кассеты. Три десятка это тридцать.',
        'Справа четыре отдельные батарейки. Они не собрались в десяток, это четыре единицы.',
        'Вместе тридцать и ещё четыре. Тридцать плюс четыре это тридцать четыре. Значит тридцать четыре это тридцать и четыре.'
      ],
      uz: [
        "O'ttiz to'rt sonini ochamiz. Har sonda ikki o'rin, ikki xona bor. Chapda o'nliklar, o'ngda birliklar.",
        "Chapda uch kasseta. Uch o'nlik bu o'ttiz.",
        "O'ngda to'rtta alohida batareya. Ular o'nlikka yig'ilmagan, bu to'rt birlik.",
        "Birga o'ttiz va yana to'rt. O'ttiz qo'shuv to'rt bu o'ttiz to'rt. Demak o'ttiz to'rt bu o'ttiz va to'rt."
      ]
    }
  },

  // s5 — OCHILISH-4 (o'rin hal qiladi): 45 va 54, kod terish
  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Одни и те же цифры — а коды разные.', uz: 'Bir xil raqamlar — lekin kodlar har xil.' },
    tens_label: { ru: 'десятки', uz: "o'nliklar" },
    ones_label: { ru: 'единицы', uz: 'birliklar' },
    round1: { ru: 'Код: четыре десятка и пять единиц.', uz: "Kod: to'rt o'nlik va besh birlik." },
    round2: { ru: 'Код: пять десятков и четыре единицы.', uz: "Kod: besh o'nlik va to'rt birlik." },
    wrong: { ru: 'Десятки ставим слева, единицы справа. Попробуй ещё.', uz: "O'nliklarni chapga, birliklarni o'ngga qo'ying. Yana urinib ko'ring." },
    done_text: { ru: 'Место цифры решает. Слева десятки, справа единицы.', uz: "Raqamning o'rni hal qiladi. Chapda o'nliklar, o'ngda birliklar." },
    audio: {
      ru: [
        'Этот люк заперт. Его код, четыре десятка и пять единиц. Поставь цифру в разряд десятков, слева, а потом в разряд единиц.',
        'Открылся. Теперь второй люк, пять десятков и четыре единицы. Цифры те же самые, но их места поменялись.',
        'Смотри. Оба кода из цифр четыре и пять. Но места разные, поэтому и коды разные. Место цифры решает.'
      ],
      uz: [
        "Bu lyuk qulflangan. Kodi, to'rt o'nlik va besh birlik. Raqamni o'nliklar xonasiga, chapga qo'ying, keyin birliklar xonasiga.",
        "Ochildi. Endi ikkinchi lyuk, besh o'nlik va to'rt birlik. Raqamlar aynan o'sha, lekin o'rni almashdi.",
        "Qarang. Ikkala kod ham to'rt va besh raqamlaridan. Lekin o'rni har xil, shuning uchun kodlar ham har xil. Raqamning o'rni hal qiladi."
      ]
    }
  },

  // s6 — OCHILISH-5 (son o'qi): 34 qayerda
  s6: {
    eyebrow: { ru: 'Число на прямой', uz: "Son o'qida" },
    lead: { ru: 'Где стоит 34?', uz: "34 qayerda turadi?" },
    q: { ru: 'Как думаешь, где стоит 34? Нажми на линии.', uz: "Sizningcha, 34 qayerda turadi? Chiziqda bosing." },
    q_audio: { ru: 'Как думаешь, где на этой линии стоит тридцать четыре? Нажми туда, где считаешь.', uz: "Sizningcha, bu chiziqda o'ttiz to'rt qayerda turadi? O'zingiz o'ylagan joyni bosing." },
    done_text: { ru: 'Тридцать четыре стоит между тридцатью и сорока.', uz: "O'ttiz to'rt o'ttiz bilan qirq orasida turadi." },
    audio: {
      ru: [
        'Покажем тридцать четыре на числовой прямой. Десятки это большие прыжки, единицы это маленькие шаги.',
        'Три больших прыжка по десять, доходим до тридцати.',
        'И ещё четыре маленьких шага, доходим до тридцати четырёх.'
      ],
      uz: [
        "O'ttiz to'rtni son o'qida ko'rsatamiz. O'nliklar bu katta sakrashlar, birliklar bu kichik qadamlar.",
        "Uch marta o'ntadan katta sakrash, o'ttizgacha yetamiz.",
        "Va yana to'rt kichik qadam, o'ttiz to'rtgacha yetamiz."
      ]
    }
  },

  // s7 — QOIDA / QONUN (asosiy tushuntirish momenti): ko'rinadigan qoida-karta + farqlash-cheki
  s7: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    // ekranda YOZMA qonun (rang-kodli karta):
    rule: { ru: 'В двузначном числе левая цифра — десятки, правая — единицы.', uz: "Ikki xonali sonda chap raqam — o'nliklar, o'ng raqam — birliklar." },
    tens_label: { ru: 'десятки', uz: "o'nliklar" },
    ones_label: { ru: 'единицы', uz: 'birliklar' },
    check_q: { ru: 'Нажми цифру десятков.', uz: "O'nliklar raqamini bosing." },
    check_ok: { ru: 'Верно! Слева — десятки.', uz: "To'g'ri! Chapda — o'nliklar." },
    check_no: { ru: 'Десятки стоят слева. Нажми левую цифру.', uz: "O'nliklar chapda turadi. Chap raqamni bosing." },
    audio: {
      ru: [
        'Теперь запомним самое главное правило. Слушай внимательно и запомни.',
        'В двузначном числе две цифры. Как понять, где десятки, а где единицы? Только по их месту.',
        'Левая цифра это всегда десятки. Она считает кассеты, целые десятки. Здесь слева четыре, значит четыре десятка.',
        'Правая цифра это всегда единицы. Она считает отдельные батарейки, по одной. Здесь справа пять, значит пять единиц.',
        'Вот наше правило. Слева десятки, справа единицы. Запомни его.',
        'И запомни ещё. Рядом это не сложение. Три и четыре рядом дают тридцать четыре, а не семь.',
        'Поэтому сорок пять и пятьдесят четыре разные числа. Цифры одни и те же, но места разные. Место цифры решает.',
        'А теперь сам. Нажми цифру, которая показывает десятки.'
      ],
      uz: [
        "Endi eng muhim qoidani yodda tutamiz. Diqqat bilan tinglang va yodlab oling.",
        "Ikki xonali sonda ikkita raqam bor. Qaysi biri o'nlik, qaysi biri birlik, buni faqat o'rniga qarab bilamiz.",
        "Chap raqam bu har doim o'nliklar. U kassetalarni, butun o'nliklarni sanaydi. Bu yerda chapda to'rt, demak to'rt o'nlik.",
        "O'ng raqam bu har doim birliklar. U alohida batareyalarni bittalab sanaydi. Bu yerda o'ngda besh, demak besh birlik.",
        "Mana bizning qoidamiz. Chapda o'nliklar, o'ngda birliklar. Buni yodda tuting.",
        "Va yana yodda tuting. Yonma-yon bu qo'shish emas. Uch va to'rt yonma-yon o'ttiz to'rt beradi, yetti emas.",
        "Shuning uchun qirq besh va ellik to'rt boshqa-boshqa sonlar. Raqamlar bir xil, lekin o'rni har xil. Raqamning o'rni hal qiladi.",
        "Endi o'zingiz. O'nliklarni ko'rsatadigan raqamni bosing."
      ]
    }
  },

  // s8 — MASHQ-1 (scored, build+check): 45 ni yig'ish
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Собери 45.', uz: "45 ni yig'ing." },
    src_tens: { ru: 'кассета +', uz: 'kasseta +' },
    src_ones: { ru: 'батарейка +', uz: 'batareya +' },
    tens_label: { ru: 'десятки', uz: "o'nliklar" },
    ones_label: { ru: 'единицы', uz: 'birliklar' },
    check_label: { ru: 'Проверить', uz: 'Tekshirish' },
    audio: {
      intro: { ru: 'Собери сорок пять из кассет и батареек. Потом нажми проверить.', uz: "Qirq beshni kasseta va batareyalardan yig'ing. Keyin tekshirishni bosing." },
      on_correct: { ru: 'Верно. Четыре десятка и пять единиц, сорок пять.', uz: "To'g'ri. To'rt o'nlik va besh birlik, qirq besh." },
      on_wrong: { ru: 'Проверь. Сначала набери десятки, потом единицы.', uz: "Tekshiring. Avval o'nliklarni, keyin birliklarni yig'ing." }
    }
  },

  // s9 — MASHQ-2 (scored, tasniflash): kasseta->o'nlik, batareya->birlik
  s9: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Разложи груз по отсекам.', uz: 'Yukni tryumlarga ajrating.' },
    hold_tens: { ru: 'ДЕСЯТКИ', uz: "O'NLIKLAR" },
    hold_ones: { ru: 'ЕДИНИЦЫ', uz: 'BIRLIKLAR' },
    audio: {
      intro: { ru: 'Бортовой сортировщик. Кассеты в одну сторону, отдельные батарейки в другую.', uz: "Bort saralagichi. Kassetalar bir tomonga, alohida batareyalar boshqa tomonga." },
      on_correct: { ru: 'Верно. Кассеты десятки, батарейки единицы.', uz: "To'g'ri. Kassetalar o'nliklar, batareyalar birliklar." },
      on_wrong: { ru: 'Кассета это десять батареек, значит десяток. Одна батарейка единица.', uz: "Kasseta o'nta batareya, demak o'nlik. Yolg'iz batareya birlik." }
    }
  },

  // s10 — MASHQ-3 (scored MC): 5 o'nlik 2 birlik -> 52
  s10: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Какое число — пять десятков и две единицы?', uz: "Qaysi son — besh o'nlik va ikki birlik?" },
    // ASL variantlar: [52(correct), 25, 7, 502]
    wrong_1: { ru: 'Здесь два десятка и пять единиц. Поменяй местами.', uz: "Bu yerda ikki o'nlik va besh birlik. O'rnini almashtiring." },
    wrong_2: { ru: 'Семь получится, если сложить. А десятки и единицы стоят отдельно.', uz: "Yetti — qo'shsak chiqadi. O'nlik va birlik alohida turadi." },
    wrong_3: { ru: 'Это слишком большое число. У нас только десятки и единицы.', uz: "Bu juda katta son. Bizda faqat o'nlik va birlik." },
    audio: {
      intro: { ru: 'Какое число, пять десятков и две единицы?', uz: "Qaysi son, besh o'nlik va ikki birlik?" },
      on_correct: { ru: 'Верно. Пять десятков и две единицы, пятьдесят два.', uz: "To'g'ri. Besh o'nlik va ikki birlik, ellik ikki." },
      on_wrong: { ru: 'Посмотри разбор. Десятки слева, единицы справа.', uz: "Tushuntirishga qarang. O'nliklar chapda, birliklar o'ngda." }
    }
  },

  // s11 — MASHQ-4 (scored MC): taqqoslash 45 va 54
  s11: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'У какого корабля топлива больше?', uz: "Qaysi kemada yoqilg'i ko'p?" },
    opt0: { ru: 'Корабль сорок пять', uz: 'Qirq besh kemasi' },
    opt1: { ru: 'Корабль пятьдесят четыре', uz: "Ellik to'rt kemasi" },   // correct (idx 1)
    audio: {
      intro: { ru: 'Два корабля встретились. У кого топлива больше? Сначала сравни десятки.', uz: "Ikki kema uchrashdi. Qaysida yoqilg'i ko'p? Avval o'nliklarni solishtiring." },
      on_correct: { ru: 'Верно. Пять десятков больше четырёх десятков.', uz: "To'g'ri. Besh o'nlik to'rt o'nlikdan katta." },
      on_wrong: { ru: 'Сначала сравни десятки. У кого кассет больше, у того топлива больше.', uz: "Avval o'nliklarni solishtiring. Kimda kasseta ko'p, o'shanda yoqilg'i ko'p." }
    }
  },

  // s12 — MASALA (kirish/kontekst): yuk xati, ekipajdan Anvar
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Накладная: 6 кассет и 3 батарейки.', uz: 'Yuk xati: 6 kasseta va 3 batareya.' },
    manifest_label: { ru: 'накладная', uz: 'yuk xati' },
    audio: {
      ru: 'Анвар принёс накладную. Шесть кассет по десять это шесть десятков. И три отдельные батарейки это три единицы.',
      uz: "Anvar yuk xatini keltirdi. Oltita kasseta o'ntadan bu olti o'nlik. Va uchta alohida batareya bu uch birlik."
    }
  },

  // s13 — MASALA (savol, scored MC): jami 63
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    q: { ru: 'Сколько всего?', uz: 'Jami nechta?' },
    // ASL variantlar: [63(correct), 36, 9, 60]
    wrong_1: { ru: 'Кассеты это десятки, их шесть. Поставь десятки слева.', uz: "Kassetalar — o'nliklar, ular oltita. O'nliklarni chapga qo'ying." },
    wrong_2: { ru: 'Девять, если сложить шесть и три. А в кассетах по десять.', uz: "To'qqiz — olti va uchni qo'shsak. Kassetalarda esa o'ntadan." },
    wrong_3: { ru: 'Не забудь три отдельные батарейки.', uz: 'Uchta alohida batareyani unutmang.' },
    audio: {
      intro: { ru: 'Посчитаем, сколько всего. Кассеты десятки, отдельные батарейки единицы.', uz: "Jami qanchaligini sanaymiz. Kassetalar o'nliklar, alohida batareyalar birliklar." },
      on_correct: { ru: 'Верно. Шесть десятков и три единицы, шестьдесят три.', uz: "To'g'ri. Olti o'nlik va uch birlik, oltmish uch." },
      on_wrong: { ru: 'Посмотри разбор. Кассеты десятки, их шесть.', uz: "Tushuntirishga qarang. Kassetalar o'nliklar, ular oltita." }
    }
  },

  // s14 — FINAL (scored MC + FactCard): 4 kasseta + 7 batareya -> 47
  s14: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    q: { ru: 'Какое число на табло?', uz: 'Displeyda qaysi son?' },
    // ASL variantlar: [47(correct), 74, 11, 407]
    wrong_1: { ru: 'Считай: кассет четыре — это десятки, слева.', uz: "Sanang: kasseta to'rtta — o'nliklar, chapda." },
    wrong_2: { ru: 'Одиннадцать, если сложить. А десятки и единицы пишут рядом.', uz: "O'n bir — qo'shsak. O'nlik va birlik yonma-yon yoziladi." },
    wrong_3: { ru: 'Это слишком большое. Только десятки и единицы.', uz: "Bu juda katta. Faqat o'nlik va birlik." },
    fact_badge: { ru: 'Знаешь?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Перед стартом ракеты ведут обратный отсчёт: десять, девять, восемь… Старт!', uz: "Raketa uchishidan oldin teskari sanaladi: o'n, to'qqiz, sakkiz… Start!" },
    fact_audio: { ru: 'Перед стартом ракеты ведут обратный отсчёт. Десять, девять, восемь и в конце старт.', uz: "Raketa uchishidan oldin teskari sanaladi. O'n, to'qqiz, sakkiz va oxirida start." },
    audio: {
      intro: { ru: 'Посмотри на кассеты и батарейки. Собери число.', uz: "Kasseta va batareyalarga qarang. Sonni yig'ing." },
      on_correct: { ru: 'Верно. Четыре десятка и семь единиц, сорок семь.', uz: "To'g'ri. To'rt o'nlik va yetti birlik, qirq yetti." },
      on_wrong: { ru: 'Посмотри разбор. Кассет четыре, это десятки, слева.', uz: "Tushuntirishga qarang. Kasseta to'rtta, o'nliklar, chapda." }
    }
  },

  // s15 — YAKUN: uchish + QOIDA recap + bog'lanishlar
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!' },
    mission_done: { ru: 'Миссия выполнена!', uz: 'Missiya bajarildi!' },
    cando: { ru: 'Топливо на борту! Теперь ты умеешь видеть в числе десятки и единицы.', uz: "Yoqilg'i bortda! Endi siz sonda o'nlik va birlikni ko'ra olasiz." },
    // QOIDA recap (ko'rinadigan):
    rule_recap: { ru: 'Левая цифра — десятки, правая — единицы.', uz: "Chap raqam — o'nliklar, o'ng — birliklar." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'первый класс: счёт, десять единиц — один десяток', uz: "birinchi sinf: sanash, o'nta birlik — bitta o'nlik" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'Урок 2: чтение и запись бортовых кодов', uz: "2-dars: bort kodlarini o'qish va yozish" },
    audio: {
      ru: 'Миссия выполнена. Топливо собрано десятками, двигатель заправлен, корабль летит дальше. Запомни правило. Десять единиц это один десяток. Левая цифра десятки, правая единицы. Одна планета позади, мы ближе к дому. В следующий раз научимся читать и записывать бортовые числа.',
      uz: "Missiya bajarildi. Yoqilg'i o'nliklarga yig'ildi, dvigatel to'ldi, kema uchdi. Qoidani yodda tuting. O'n birlik bu bitta o'nlik. Chap raqam o'nliklar, o'ng birliklar. Bir sayyora ortda, biz uyga yaqinmiz. Keyingi safar bort sonlarini o'qish va yozishni o'rganamiz."
    }
  }
};

// v8 missiya-zanjiri — slaydlararo ↳ ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Теперь проверим, как ты понял.', uz: 'Endi qanday tushunganingizni tekshiramiz.' },
  s2:  { ru: 'Готовим топливо. Сначала посмотрим, что такое десяток.', uz: "Yoqilg'ini tayyorlaymiz. Avval o'nlik nima, ko'ramiz." },
  s3:  { ru: 'Десяток понятен. Теперь соберём из них числа.', uz: "O'nlikni bildik. Endi undan sonlarni yig'amiz." },
  s4:  { ru: 'Собрали. Теперь заглянем внутрь числа.', uz: "Yig'dik. Endi sonning ichiga qaraymiz." },
  s5:  { ru: 'Внимание. Место цифры решает.', uz: "Diqqat. Raqamning o'rni muhim." },
  s6:  { ru: 'Покажем это число на прямой.', uz: "Shu sonni o'qda ko'rsatamiz." },
  s7:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.' },
  s8:  { ru: 'Правило знаем. Теперь готовь топливо сам.', uz: "Qoidani bilamiz. Endi yoqilg'ini o'zingiz tayyorlang." },
  s9:  { ru: 'Разложим груз по отсекам.', uz: 'Yukni tryumlarga ajratamiz.' },
  s10: { ru: 'Проверим ещё раз.', uz: 'Yana bir tekshiramiz.' },
  s11: { ru: 'Два корабля встретились.', uz: 'Ikki kema uchrashdi.' },
  s12: { ru: 'Последний груз. Сколько по накладной?', uz: "Oxirgi yuk. Xatda nechta?" },
  s13: { ru: 'Считаем всё вместе.', uz: 'Hammasini birga sanaymiz.' },
  s14: { ru: 'Стартовый компьютер сделает финальную проверку.', uz: 'Uchish kompyuteri yakuniy tekshiradi.' },
  s15: { ru: 'Топливо готово. Взлетаем!', uz: "Yoqilg'i tayyor. Uchamiz!" }
};

// s15 uchish-payoff (xulosadan oldin aytiladi)
const S15_PAYOFF = {
  ru: 'Топливо собрано десятками, двигатель заправлен. Корабль взлетает! Одна планета позади, спасибо за помощь.',
  uz: "Yoqilg'i o'nliklarga yig'ildi, dvigatel to'ldi. Kema uchmoqda! Bir sayyora ortda, yordamingiz uchun rahmat."
};
```

---

## Metodistga eslatmalar

1. **UZ terminlar (draft, validatsiya kerak):** o'nlik / birlik / ikki xonali son / xona
   (razryad) — `2sinf_metodologiya §11` glossariydan; 1-sinf Dars01–03 bilan izchil.
2. **Audio uzun tire tozalandi (ETALON §7):** eski versiyada audio'da `—` bor edi (latent
   nuqson) — bu versiyada nuqta/vergul bilan almashtirildi. Ko'rinadigan matnда tire qoladi.
3. **s0 ikki nuqta:** «тема урока: …» o'rniga «тема урока — …» (ko'rinadigan) / audio'da
   «тема урока, …» — §7 ikki-nuqta-ro'yxat qoidasi.
4. **Sayohat qobig'i:** hook (s0) va yakun (s15) yangi — sayyoraga qo'nish + uchish/uyga
   yaqinlash. s11/s12 «груз»→«топливо»/ekipaj (Anvar) reframe. Qolgan matn matematik jihatдан
   eski QA-toza versiyадан.
5. **Tushuntirish kuchaytirildi:** s4 (razryad kartasi) alohida ochilish bo'ldi; s6 (son o'qi)
   alohida; s7 — QOIDA kartasi + «yonma-yon ≠ qo'shish» qo'shildi; s15 — QOIDA recap.
6. **Ekipaj kiyimi + do'stlar** hook/yakun/s12 da — jsx-builder bosqichida (SVG kostyum qatlami).
```
