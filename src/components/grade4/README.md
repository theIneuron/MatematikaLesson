# 4-sinf darslari

Bu papka 4-sinf matematika kursining yagona komponentlar manzili:

- `DarsNN.jsx` — nazariy interaktiv dars va uning inline UZ/RU/EN kontenti;
- `DarsNNPractice.jsx` — shu darsga tegishli ovozsiz amaliy mashqlar va inline UZ/RU/EN kontenti.

Yangi dars komponenti shu yerda yaratiladi va `src/lessons/grade4.js` registriga ulanadi.

## Til kontrakti

- LMS `lang` propiga `uz`, `ru` yoki `en` uzatadi; prop berilmasa standalone preview `uz`dan boshlanadi.
- Noto'g'ri `lang` qiymati `uz`ga tushadi. Foydalanuvchi ko'radigan har bir lokalizatsiya node'i `{ uz, ru, en }` bo'lishi shart.
- Standalone preview til paneli aynan `UZ / RU / EN` tartibida ishlaydi. Til almashganda ekran, javoblar va progress saqlanadi.
- Nazariy darslardagi mavjud audio barcha uch tilda bir xil segment soni va tartibini saqlaydi. Preview Web Speech uchun ingliz tili `en-GB`; production HTTP TTS kontrakti faqat `text` va `g` parametrlaridan iborat.
- Amaliy darslar ovozsiz qoladi. Ularga audio engine, narratsiya yoki Bit qo'shilmaydi.
- `LESSON_META.lessonTitle` uch tilda to'ldiriladi va `onFinished.lessonTitle` tanlangan tilda qaytadi.
- Ingliz terminlari va TTS shakllari `EN_GLOSSARY.md` bo'yicha yoziladi.

Tekshiruv: `npm run lint:grade4:trilingual` faqat migratsiya targetlari va ularning audit/smoke infratuzilmasini lint qiladi. `npm run audit:grade4:trilingual` migratsiya scope'idagi Dars01–Dars30 va Dars01Practice–Dars30Practice komponentlari uchun til to'liqligi, selectorlar, theory audio parity va practice audio-free kontraktini tekshiradi. `npm run test:grade4:browser:trilingual` shu 60 route'ni UZ/RU/EN va belgilangan viewportlarda tekshiradi. To'liq Grade 4 inventari 51 theory + 30 practice, ya'ni 81 route. `npm run audit:grade4` esa kengaytirilgan kurs auditini, jumladan Dars31–51 uchun 15 slayd/50 avtomatik frame kontraktini ham ishga tushiradi.
