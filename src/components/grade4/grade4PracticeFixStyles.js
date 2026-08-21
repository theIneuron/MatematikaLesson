// 4-sinf AMALIY darslari uchun umumiy tuzatish qatlami.
//
// Metodist qarori 2026-08-21. Amaliy darslar bir-biridan mustaqil yozilgan
// (umumiy qatlam yo'q, har fayl o'z CSS nusxasi bilan), shuning uchun bir xil
// nosozlik ellik bir joyda takrorlanadi. Tuzatish shu modulda turadi va har
// darsga IMPORT qilinadi — nusxa emas (CLAUDE.md 5-bo'lim). Dars faylida
// oxirgi bo'lib qo'shiladi, shuning uchun o'z nusxasidan ustun keladi:
//
//   <style>{STYLES + PRACTICE_FIX_CSS}</style>
//
// ---------------------------------------------------------------------------
// 1. TEKSHIRISH TUGMASI O'NGDA
//
// 2-darsda tugmalar qatori `justify-content: flex-end` bilan o'ngda turadi va
// metodist shuni etalon deb ko'rsatdi. Dars01 va Dars22-51 da bu xossa
// yo'zilmagan, shuning uchun tugma chapda qolib, o'n bir dars boshqa o'n
// darsdan boshqacha ko'rinardi.
//
// ---------------------------------------------------------------------------
// 2. MOSLASHTIRISHDA IKKI TOMON RAMKALARI TENG
//
// Moslashtirish topshirig'ida chap tomonda chizma bilan kartochka (80 px),
// o'ng tomonda esa faqat matn (44 px) turardi — juftlar bir qatorda
// tekislanmasdi va ikki tomon ko'zga boshqa o'lchamda ko'rinardi (Dars41,
// 9-topshiriq: 80 px va 44 px).
//
// Yechim: ustun grid bo'ladi va qatorlari `1fr` — bir ustundagi hamma
// kartochka bir xil balandlik oladi. Ustunlarning umumiy balandligi allaqachon
// teng (idish `stretch` qiladi), shuning uchun juftlar qator bo'yicha
// tekislanadi.
//
// Cheklov: bu chap va o'ngda kartochkalar SONI teng bo'lganda ishlaydi.
// Moslashtirishda juftlik shart, shuning uchun bu doim shunday; agar biror
// darsda o'ng tomonga qo'shimcha "aldov" kartochkasi qo'shilsa, qatorlar
// siljiydi va o'sha darsga alohida qoida kerak bo'ladi.
export const PRACTICE_FIX_CSS = `
.p4-actions, .g4p-actions { justify-content: flex-end; }

.p4-match-cols, .g4p-match-cols { align-items: stretch; }
.p4-match-col, .g4p-match-col {
  display: grid;
  grid-auto-rows: 1fr;
  align-content: stretch;
}
`;
