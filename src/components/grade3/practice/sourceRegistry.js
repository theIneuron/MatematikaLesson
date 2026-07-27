export const GRADE3_BOOK = {
  title: "Matematika 3-sinf darsligi",
  edition: "S. Burxonov va boshqalar, Sharq, 2019",
  workbook: "Matematika 3-sinf mashq daftari, 2022",
  methodology: "Matematika 3-sinf metodik qo'llanma, 2022",
};

const source = (bookRef, skills) => ({
  provider: '3-sinf darsligi',
  book: `${GRADE3_BOOK.title}, 2019; mashq daftari, 2022`,
  bookRef,
  skills: Array.isArray(skills) ? skills : [skills],
  adaptation: "Savol sonlari va hayotiy vaziyati interaktiv amaliyot uchun moslashtirilgan.",
});

// Dars raqamlari loyiha rejasiga tegishli. Kitobdagi bob/darslar
// loyiha raqamiga emas, o'rganiladigan ko'nikmaga qarab moslangan.
export const GRADE3_PRACTICE_SOURCES = {
  1: source("1-bob, 1–5-dars; mashq daftari 3–7-betlar", [
    "Xona birliklari bo'yicha sonni aniqlash",
    "Xona birligidagi raqamning qiymatini topish",
  ]),
  2: source("1-bob, 1–6-dars; mashq daftari 3–8-betlar", [
    "Ko'p xonali sonlarni o'qilishi",
    "Ko'p xonali sonlarni yozilishi",
  ]),
  3: source("1-bob, 7–10-dars; mashq daftari 9–11-betlar", [
    "Xona qo'shiluvchilari yig'indisi",
    "Xona birliklari orasidagi bog'lanish",
  ]),
  4: source("1-bob, 11–12-dars; mashq daftari 12–13-betlar", [
    "Sonlarni taqqoslash",
    "Sonlarni tartiblash",
  ]),
  5: source("1-bobdagi sonlarni taqqoslash va tartiblash mashqlari", [
    "Eng katta va eng kichik sonlarni aniqlash",
    "Sonlarni tartiblash",
  ]),
  6: source("1-bobdagi sonlar ketma-ketligi va shkala mashqlari", [
    "Sonlarni son chizig'i yordamida taqqoslash",
    "Koordinata nuri yordamida taqqoslash",
  ]),
  7: source("2-bob, 1–23-dars; 1000 ichida qo'shish va ayirish", [
    "Uch xonali sonlarni ustun shaklida qo'shish",
    "Uch xonali sonlarni ustun shaklida ayirish",
  ]),
  8: source("6-bob, 8–9-dars; Rim raqamlari", [
    "Rim raqamlari yordamida sonlarni yozish va o'qish",
    "Rim raqamli soatlarni aniqlash",
  ]),
  9: source("Takrorlash, 3-dars va 3-bob; ko'paytirish", [
    "Ko'paytirish jadvali",
    "Ko'paytirishning o'rin almashtirish xossasi",
  ]),
  10: source("3-bobdagi yaxlit sonlarni ko'paytirish va bo'lish mashqlari", [
    "Sonni 10 ga ko'paytirish",
    "Sonni 100 ga ko'paytirish",
    "Sonni 10 va 100 ga bo'lish",
  ]),
  11: source("3-bob, 1–12-dars; ko'paytirish usullari", [
    "Xona birligi qiymati ko'rinishida tasvirlab, ko'paytirish",
    "Yuza modeli yordamida ko'paytirish",
  ]),
  12: source("3-bob, 13–24-dars; bo'lish usullari", [
    "Yig'indini songa bo'lish",
    "Ikki xonali sonni bir xonali songa bo'lish",
  ]),
  13: source("7-bob, 1–4-dars; amallarni bajarish tartibi", [
    "Qo'shish, ayirish, ko'paytirish va bo'lish",
    "Arifmetik ifodani to'ldirish",
  ]),
  14: source("3-bob va 7-bob; amal komponentlari orasidagi bog'lanish", [
    "Ko'paytirish yoki bo'lish tengligini to'ldirish",
    "Yig'indi, ayirma, ko'paytma va bo'linmaga ko'ra sonni topish",
  ]),
  15: source("3-bob, 25–26-dars; ko'paytirish va bo'lishga doir masalalar", [
    "Ko'paytirish va bo'lishga doir masalalar yechish",
    "Hayotiy masalalar yechish",
  ]),
  16: source("3-bob, bo'lish va qoldiqli bo'lish mashqlari", [
    "Bo'luvchilar va karralilar",
    "Sonlarni bo'lish",
  ]),
  17: source("3-bob, 1–6-dars; ikki xonali sonni bir xonali songa ko'paytirish", [
    "Ikki xonali sonni bir xonali songa ko'paytirish",
    "Yuza modeli yordamida ko'paytirish",
  ]),
  18: source("3-bob, 13–18-dars; ikki xonali sonni bo'lish", [
    "Ikki xonali sonni bir xonali songa bo'lish",
    "Ikki xonali sonni ikki xonali songa bo'lish",
  ]),
  19: source("3-bob, 29–31-dars; qoldiqli bo'lish", [
    "Qoldiqli bo'lish",
    "Ko'p xonali sonlarni qoldiqli bo'lish",
  ]),
  20: source("3-bob, 27–28-dars; ko'paytirish va bo'lishni tekshirish", [
    "Qo'shish va ayirish orasidagi bog'liqlik",
    "Ko'paytirish va bo'lishni tekshirish",
  ]),
  21: source("3-bob, 7–24-dars; yozma ko'paytirish va bo'lish", [
    "Ustun shaklida ko'paytirish",
    "Burchakli bo'lish",
  ]),
  22: source("3-bobdagi yozma ko'paytirish algoritmlari", [
    "Ikki xonali sonni ikki xonali songa ko'paytirish",
    "Qismiy ko'paytmalar",
  ]),
  23: source("3-bob, 25–26-dars; ikki amalli hayotiy masalalar", [
    "Model yordamida ikki bosqichli masalalar yechish",
    "Arifmetik amallarga oid ikki bosqichli masalalar",
  ]),
  24: source("4-bob, 1–5-dars; kasr haqida tushuncha", [
    "Doirani teng bo'laklarga bo'lish",
    "Sonning ulushini topish",
  ]),
  25: source("4-bob, 1–5-dars; kasr modeli, surat va maxraj", [
    "Doiraning ulushlari",
    "Kasrni model orqali aniqlash",
  ]),
  26: source("4-bob, 11–13-dars; kasrlarni taqqoslash", [
    "Ulushlarni model yordamida taqqoslash",
    "Sonning ulushini topish",
  ]),
  27: source("4-bob, 1–5 va 11–13-dars; sonning kasr qismini topish", [
    "Sonning ulushini topish",
    "Ulushga doir masalalar",
  ]),
  28: source("4-bobdagi butun va kasr modellari", [
    "Doirani teng bo'laklarga bo'lish",
    "Doiraning ulushlari",
  ]),
  29: source("4-bob, 11–13-dars; kasrlarni taqqoslash", [
    "Kasrlarni taqqoslash",
    "Teng kasrlarni aniqlash",
  ]),
  30: source("4-bob, 6–10-dars; bir xil maxrajli kasrlar", [
    "Bir xil maxrajli kasrlarni qo'shish",
    "Bir xil maxrajli kasrlarni ayirish",
  ]),
  31: source("4-bobdagi o'ndan va yuzdan ulush modellari", [
    "Yuz o'lchov birliklari orasidagi bog'lanishlar",
    "Ulushlarni son bilan ifodalash",
  ]),
  32: source("4-bob; kasrlarga doir amaliy va mantiqiy topshiriqlar", [
    "Sonning ulushini topish",
    "Ulushlarga doir masalalar yechish",
  ]),
  33: source("5-bobdagi yassi shakllar va o'lchash topshiriqlari", [
    "To'g'ri to'rtburchakning perimetri",
    "Ko'pburchaklarning perimetri",
  ]),
  34: source("5-bob, 10–11-dars; shakllar yuzini o'lchash", [
    "Birlik kvadratlar yordamida shakllarning yuzini topish",
    "Yuzlarni paletka yordamida hisoblash",
  ]),
  35: source("5-bob, 10–11-dars; katakli yuza modeli", [
    "To'g'ri to'rtburchak yuzini hisoblash",
    "Noma'lum tomon uzunligini topish",
  ]),
  36: source("5-bobdagi kvadrat va yuza mashqlari", [
    "Kvadrat yuzini hisoblash",
    "Kvadratning noma'lum tomon uzunligini topish",
  ]),
  37: source("5-bobdagi shakllarni o'lchash va taqqoslash topshiriqlari", [
    "Perimetri yoki yuzi teng bo'lgan shakllar",
    "Yuza va perimetr orasidagi bog'lanish",
  ]),
  38: source("5-bobdagi amaliy geometrik masalalar", [
    "Yuza, perimetr yoki tomon uzunligini topish",
    "Perimetrga doir masalalar yechish",
  ]),
  39: source("5-bob, 4–9-dars; chiziqlar va uchburchak turlari", [
    "Parallel to'g'ri chiziqlar",
    "Perpendikulyar to'g'ri chiziqlar",
    "Ko'pburchaklarni aniqlash",
  ]),
  40: source("5-bob, 12–14-dars; simmetriya va shakl harakatlari", [
    "O'qli simmetriya",
    "Simmetrik shakllar",
  ]),
  41: source("5-bob, 15–18-dars; fazoviy geometrik shakllar", [
    "Parallelepiped va kub",
    "Fazoviy shakllarning yoyilmasi",
  ]),
  42: source("6-bob, 3–4-dars; massa o'lchov birliklari", [
    "Kilogramm va gramm",
    "Massa birliklarini taqqoslash",
    "Taroziga oid topshiriqlar",
  ]),
  43: source("6-bob, 5–7-dars; vaqt o'lchov birliklari", [
    "Vaqtni aniqlash",
    "Strelkali va elektron soatlarni moslashtirish",
    "Vaqt birliklari ustida amallar",
  ]),
  44: source("6-bob, 1–2 va 11–13-dars; uzunlik birliklari", [
    "Uzunlik o'lchov birliklari",
    "Uzunlik o'lchov birliklarini taqqoslash",
  ]),
  45: source("6-bob, 5–7-dars; yil, oy, hafta va sutka", [
    "Vaqt o'lchov birliklari",
    "Vaqtga doir masalalar yechish",
  ]),
  46: source("7-bob, 7–13-dars; tenglamalar", [
    "Sodda tenglamalar",
    "Tarkibli tenglamalar",
  ]),
  47: source("7-bob, 7–13-dars; tenglamani yechish va tekshirish", [
    "Tenglamalarni soddalashtirish",
    "Qo'shish, ayirish, ko'paytirish va bo'lishga oid tenglamalar",
  ]),
  48: source("Darslikdagi ikki amalli hayotiy va xalqaro baholash topshiriqlari", [
    "Model yordamida ikki bosqichli masalalar yechish",
    "Mantiqiy masalalar",
  ]),
  49: source("1 va 7-bobdagi taqqoslash, tenglik va mulohaza topshiriqlari", [
    "Tengliklar",
    "Tengsizliklar",
    "Mulohazalar",
  ]),
  50: source("8-bob, 6–13-dars; diagramma va ma'lumotlar", [
    "Diagrammadagi ma'lumotlarni tahlil qilish",
    "Doiraviy diagrammalarni tahlil qilish",
  ]),
  51: source("Darslikning takrorlash va xalqaro baholash bo'limlari", [
    "Yakuniy nazorat ishi — oson",
    "Yakuniy nazorat ishi — o'rta",
    "Yakuniy nazorat ishi — murakkab",
  ]),
};

export function getGrade3PracticeSource(number) {
  return GRADE3_PRACTICE_SOURCES[Number(number)] || null;
}
