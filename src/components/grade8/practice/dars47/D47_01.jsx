// Dars47 · Amaliyot 01 — Belgilash · 🟢 · tag: egypt_multiples
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §9 (47-dars, 1-pozitsiya)
//
// AMALIY MASALANING ASOSI (T1): ipni 3 : 4 : 5 NISBATDA bo'lish. Nisbat
// saqlansa uchburchak to'g'ri burchakli bo'lib qoladi, ya'ni misr uchburchagi
// ikki, uch, o'n barobar kattalashtirilishi mumkin.
//
// ENG QIMMAT TUZOQ — `5, 12, 13`: u ham to'g'ri burchakli, lekin BOSHQA
// uchlik, ya'ni misr uchburchagining kattalashtirilgani emas. Savol aynan
// nisbat haqida, «to'g'ri burchaklimi» degan savol emas (u 45-darsda edi).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'egypt_multiples', level: '🟢',
  col: 104, itemSize: 15,
  items: [
    { id: 'i1', hit: true, tokens: ['3, 4, 5'] },
    { id: 'i2', tokens: ['5, 12, 13'] },
    { id: 'i3', hit: true, tokens: ['6, 8, 10'] },
    { id: 'i4', tokens: ['4, 5, 6'] },
    { id: 'i5', hit: true, tokens: ['9, 12, 15'] },
    { id: 'i6', tokens: ['6, 7, 8'] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Misr uchburchagi — tomonlari uch, to'rt, besh bo'lgan uchburchak: quruvchilar ip bilan to'g'ri burchak yasashda undan foydalanadi. Uni kattalashtirish mumkin, lekin NISBAT saqlanishi kerak.",
    'Египетский треугольник — треугольник со сторонами три, четыре, пять: строители используют его, чтобы верёвкой построить прямой угол. Его можно увеличить, но ОТНОШЕНИЕ должно сохраниться.',
    'The Egyptian triangle has sides three, four, five: builders use it to lay out a right angle with a rope. It can be scaled up, but the RATIO must be kept.'),
  ask: L(
    "Misr uchburchagining kattalashtirilgani bo'lgan 3 ta uchlikni belgilang.",
    'Отметь 3 тройки, которые являются увеличенным египетским треугольником.',
    'Mark the 3 triples that are the Egyptian triangle scaled up.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchtasi ham uch, to'rt, besh nisbatini saqlaydi: birinchisi o'zi, ikkinchisi ikki barobar (olti, sakkiz, o'n), uchinchisi uch barobar (to'qqiz, o'n ikki, o'n besh). Nisbat saqlanganda burchaklar o'zgarmaydi, ya'ni to'g'ri burchak joyida qoladi — ipni shu nisbatda bo'lgan quruvchi har doim to'g'ri burchak oladi. Diqqat qiladigan joy: besh, o'n ikki, o'n uch ham to'g'ri burchakli, lekin u BOSHQA uchlik — uni uch, to'rt, beshga ko'paytirib olib bo'lmaydi. Qolgan ikkitasi esa umuman to'g'ri burchakli emas: to'rt, besh, olti da o'n olti qo'shuv yigirma besh qirq bir, olti kvadrat esa o'ttiz olti.",
    'Верно. Все три сохраняют отношение три, четыре, пять: первая сама тройка, вторая вдвое больше (шесть, восемь, десять), третья втрое (девять, двенадцать, пятнадцать). При сохранении отношения углы не меняются, значит прямой угол остаётся на месте — строитель, разделивший верёвку в этом отношении, всегда получит прямой угол. На что стоит обратить внимание: пять, двенадцать, тринадцать тоже прямоугольная, но это ДРУГАЯ тройка — умножением из три, четыре, пять её не получить. А остальные две вообще не прямоугольные: у четыре, пять, шесть шестнадцать плюс двадцать пять — сорок один, а шесть в квадрате тридцать шесть.',
    'Correct. All three keep the ratio three, four, five: the first is the triple itself, the second twice it (six, eight, ten), the third three times (nine, twelve, fifteen). Keeping the ratio keeps the angles, so the right angle stays — a builder who divides the rope in this ratio always gets a right angle. Worth noticing: five, twelve, thirteen is right-angled too, but it is a DIFFERENT triple — no multiplying of three, four, five yields it. The other two are not right-angled at all: for four, five, six, sixteen plus twenty five is forty one while six squared is thirty six.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Besh, o'n ikki, o'n uch — to'g'ri burchakli uchburchak, lekin savol boshqa narsa haqida: u misr uchburchagining KATTALASHTIRILGANI emas. Tekshirish oson: uchni nechaga ko'paytirsak besh chiqadi? Bir butun olti o'ndan. O'sha songa to'rtni ko'paytirsak olti butun to'rt o'ndan chiqadi, o'n ikki emas. Ya'ni nisbat boshqa: bu ikkinchi Pifagor uchligi.",
      'Пять, двенадцать, тринадцать — прямоугольный треугольник, но вопрос о другом: это не УВЕЛИЧЕННЫЙ египетский треугольник. Проверить легко: на что умножить три, чтобы вышло пять? На один и шесть десятых. Умножив на то же число четыре, получим шесть и четыре десятых, а не двенадцать. Значит отношение другое: это вторая пифагорова тройка.',
      'Five, twelve, thirteen is a right triangle, but the question is about something else: it is not the Egyptian triangle SCALED. An easy check: by what do you multiply three to get five? By one point six. Multiplying four by the same gives six point four, not twelve. So the ratio differs: this is a second Pythagorean triple.') },
    { when: (s) => s.extra.indexOf('i4') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "Bu uchliklar to'g'ri burchakli ham emas. Ketma-ket sonlar (to'rt, besh, olti va olti, yetti, sakkiz) uch, to'rt, beshga o'xshab ko'rinadi, lekin o'xshashlik yetmaydi: to'rt, besh, oltida o'n olti qo'shuv yigirma besh qirq bir, olti kvadrat esa o'ttiz olti; olti, yetti, sakkizda o'ttiz olti qo'shuv qirq to'qqiz sakson besh, sakkiz kvadrat esa oltmish to'rt. Nisbat uch, to'rt, besh bo'lishi kerak, shunchaki ketma-ket bo'lishi kifoya qilmaydi.",
      'Эти тройки даже не прямоугольные. Последовательные числа (четыре, пять, шесть и шесть, семь, восемь) похожи на три, четыре, пять, но похожести мало: у четыре, пять, шесть шестнадцать плюс двадцать пять — сорок один, а шесть в квадрате тридцать шесть; у шесть, семь, восемь тридцать шесть плюс сорок девять — восемьдесят пять, а восемь в квадрате шестьдесят четыре. Отношение должно быть три, четыре, пять, а просто последовательности недостаточно.',
      'These triples are not even right-angled. Consecutive numbers (four, five, six and six, seven, eight) look like three, four, five, but looking alike is not enough: for four, five, six, sixteen plus twenty five is forty one while six squared is thirty six; for six, seven, eight, thirty six plus forty nine is eighty five while eight squared is sixty four. The ratio must be three, four, five; merely being consecutive will not do.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "To'qqiz, o'n ikki, o'n besh chetlab o'tildi, lekin u uch, to'rt, beshning uch barobari: uchala sonni uchga bo'lib ko'ring. Sonlar kattalashgani bilan nisbat o'zgarmaydi, ya'ni bu ham misr uchburchagi — faqat kattaroq ip bilan.",
      'Девять, двенадцать, пятнадцать пропущена, а это тройка три, четыре, пять, увеличенная втрое: раздели все три числа на три. Числа выросли, но отношение не изменилось, значит это тот же египетский треугольник — просто с более длинной верёвкой.',
      'Nine, twelve, fifteen was skipped, yet it is three, four, five tripled: divide all three numbers by three. The numbers grew but the ratio did not change, so it is the same Egyptian triangle — just with a longer rope.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta uchlik kerak. Har birini tekshirishning oson yo'li: uchala sonni umumiy ko'paytuvchiga bo'lib, uch, to'rt, besh chiqadimi deb qarash.",
      'Нужно ровно три тройки. Простой способ проверки: раздели все три числа на общий множитель и посмотри, выходит ли три, четыре, пять.',
      'Exactly three triples are needed. An easy way to check: divide all three numbers by a common factor and see whether three, four, five comes out.') },
  ],
  wrongText: L(
    "Uchala sonni umumiy ko'paytuvchiga bo'ling: uch, to'rt, besh chiqsa — bu misr uchburchagi.",
    'Раздели все три числа на общий множитель: выйдет три, четыре, пять — это египетский треугольник.',
    'Divide all three numbers by a common factor: if three, four, five comes out, it is the Egyptian triangle.'),
};

export default function D47_01(props) { return <MarkAll data={DATA} {...props} />; }
