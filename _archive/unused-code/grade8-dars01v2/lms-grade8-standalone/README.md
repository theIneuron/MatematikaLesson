# 8-sinf, 1-dars — LMS uchun avtonom fayl

`Dars01v2.jsx` — bitta fayl, tashqi havolasi YO'Q: import faqat `react`, eksport
faqat `export default`. LMS xom JSX ni klassik rejimda yuklaydi, shuning uchun
React NOM bilan import qilingan.

Props: `lang` (`uz` | `ru` | `en`), `ttsApiBase`, `studentName`, `onFinished`.
Ovoz: HTTP TTS v5.2 (`{base}/api/tts?text=...&g=m`). `ttsApiBase` berilmasa
brauzer Web Speech zaxirasi ishlaydi (faqat previu uchun).

Fayl QO'LDA tahrirlanmaydi. Manba:
`src/components/grade8/{core.jsx, labkit.jsx, Dars01v2.jsx}`.
Qayta yig'ish: `node scripts/build-grade8-dars01-lms.mjs`.
