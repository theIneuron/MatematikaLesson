// Dars12 · Amaliyot 01 — Ha/yo'q · 🟢 · teg: qoshish-orqali-yoqotish-notogri
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
//
// Uchala hukm ham bitta savolga qaytadi: qo'shganda NIMA yo'qoladi va
// undan keyin nima qoladi. Ikkinchi hukm — asosiy tuzoq: bir xil ishorada
// turgan had yo'qolmaydi, ikkilanadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'qoshish-orqali-yoqotish-notogri', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikkala tenglamani qo'shishga tayyorlanyapmiz. Uch hukm qo'shishdan keyin nima bo'lishi haqida.",
    'Готовимся сложить оба уравнения. Три суждения — о том, что будет после сложения.',
    'We are getting ready to add both equations. Three claims are about what happens after adding.'),
  ask: L(
    "Har bir hukm uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x + 3y = 11'], ['x − 3y = −1']],
  itemSize: 15,
  items: [
    { id: 's1', tokens: ['3y', 'va', '−3y'], yes: true, claim: L(
      "qo'shilganda bir-birini yo'qotadi.",
      'при сложении уничтожают друг друга.',
      'cancel each other when added.') },
    { id: 's2', tokens: ['x'], yes: false, claim: L(
      "ham qo'shilganda yo'qoladi.",
      'тоже исчезает при сложении.',
      'disappears when added as well.') },
    { id: 's3', tokens: ['x = 5'], yes: true, claim: L(
      "topilgach, igrek ikkala tenglamadan ham topilishi mumkin.",
      'найден — игрек можно найти из любого из двух уравнений.',
      'once found, y can be found from either of the two equations.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri. Uch igrek bilan minus uch igrek qarama-qarshi ishorada, shuning uchun qo'shganda nol beradi. Iks esa ikkala tenglamada ham qo'shi ishorada, demak u yo'qolmaydi, ikkilanadi: ikki iks o'nga teng, iks besh. Igrekni esa ixtiyoriy tenglamadan topish mumkin — ikkalasi ham bir xil natija beradi: besh qo'shuv uch igrek o'n bir, ya'ni igrek ikki; besh minus uch igrek minus bir, yana igrek ikki.",
    'Верно. Три игрека и минус три игрека стоят с противоположными знаками, поэтому при сложении дают нуль. А икс в обоих уравнениях с плюсом, значит он не исчезает, а удваивается: два икса равны десяти, икс равен пяти. Игрек же можно найти из любого уравнения — оба дают одно и то же: пять плюс три игрека — одиннадцать, значит игрек два; пять минус три игрека — минус один, снова игрек два.',
    'Correct. Three y and minus three y have opposite signs, so adding them gives zero. But x carries a plus in both equations, so it does not vanish, it doubles: two x equals ten, x equals five. And y can be found from either equation — both give the same: five plus three y is eleven, so y is two; five minus three y is minus one, again y is two.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Iks ikkala tenglamada ham qo'shi ishorada turibdi. Bir xil ishorada turgan hadlar qo'shilganda yo'qolmaydi, balki ikkilanadi: iks qo'shuv iks ikki iks bo'ladi.",
      'Икс в обоих уравнениях стоит с плюсом. Слагаемые с одинаковым знаком при сложении не исчезают, а удваиваются: икс плюс икс — два икса.',
      'x carries a plus in both equations. Terms with the same sign do not vanish when added, they double: x plus x is two x.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Uch igrekning oldida qo'shuv, ikkinchisining oldida minus turibdi. Ularni qo'shsangiz nol chiqadi — aynan shu narsa qo'shish usulining ma'nosi.",
      'Перед тремя игреками стоит плюс, перед вторыми — минус. Сложив их, получишь нуль — в этом и смысл способа сложения.',
      'The first three y has a plus in front, the second a minus. Adding them gives zero — and that is exactly the point of the addition method.') },
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Sistemaning ikkala tenglamasi ham bir vaqtda bajariladi, shuning uchun igrek ikkalasidan ham bir xil chiqadi. Ikkinchisiga qo'yib ko'rish — bu ayni paytda tekshiruv ham.",
      'Оба уравнения системы выполняются одновременно, поэтому игрек выходит одинаковым из обоих. Подстановка во второе — это заодно и проверка.',
      'Both equations of the system hold at once, so y comes out the same from either. Substituting into the second one doubles as a check.') },
  ],
  wrongText: L(
    "Har bir hadga alohida qarang: uning ikkala tenglamadagi ishorasi bir xilmi yoki qarama-qarshimi? Javob shundan chiqadi.",
    'Смотри на каждое слагаемое отдельно: его знаки в двух уравнениях одинаковы или противоположны? Из этого и следует ответ.',
    'Look at each term separately: are its signs in the two equations the same or opposite? The answer follows from that.'),
};

export default function D12_01(props) { return <TrueFalse data={DATA} {...props} />; }
