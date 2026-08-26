// Dars36 · Amaliyot 05 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §8 (36-dars, 5-pozitsiya)
//
// UCH BO'SHLIQ — T2 va T3. Bankdagi tuzoqlar:
//   «m + n»           — З74, asosiy qonunni qo'shishga almashtirish;
//   «ko'paytiriladi» va «qo'shiladi» ni almashtirish — T3 ning teskarisi;
//   «m − n»           — umuman ma'nosiz, lekin gapga tushadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "A dan B ga m yo'l, B dan C ga n yo'l bo'lsa, A dan C ga",
      'Если от A до B есть m путей, а от B до C есть n путей, то от A до C есть',
      'If there are m ways from A to B and n ways from B to C, then from A to C there are') },
    { slot: 0 },
    { text: L(
      "yo'l bor. Ketma-ket bosqichlar",
      'путей. Последовательные шаги', 'ways. Sequential steps') },
    { slot: 1 },
    { text: L(
      ", faqat bittasi tanlanadigan holatlar esa",
      ', а случаи, где выбирается только один вариант,', ', while cases where only one option is chosen') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('m · n', 'm · n', 'm · n') },
    { id: 'w2', label: L("ko'paytiriladi", 'перемножаются', 'are multiplied') },
    { id: 'w3', label: L("qo'shiladi", 'складываются', 'are added') },
    { id: 'w4', label: L('m + n', 'm + n', 'm + n') },
    { id: 'w5', label: L('m − n', 'm − n', 'm − n') },
    { id: 'w6', label: L("bo'linadi", 'делятся', 'are divided') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Kombinatorikaning asosiy qonuni bitta gapga yig'ilgan, lekin uchta bo'lak tushib qolgan. Bankda oltita karta, va uchtasi gapga tili bo'yicha bemalol tushadi.",
    'Основной закон комбинаторики собран в одно предложение, но три куска выпали. В банке шесть карточек, и три из них по языку встают в предложение совершенно спокойно.',
    'The basic law of combinatorics is gathered into one sentence, but three pieces fell out. The bank holds six cards, and three of them slot into the sentence perfectly well as language.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Asosiy qonun ko'paytirish beradi, va sababi sodda: A dan B ga borish uchun tanlangan HAR yo'ldan keyin B dan C ga borishning hamma yo'llari ochiq qoladi. Ya'ni m ta yo'lning har biriga n tadan davomi to'g'ri keladi — jami m karra n. Ikkinchi va uchinchi bo'shliq ikki holni ajratadi. Ketma-ket bosqichlar — bu ikkalasi ham bajariladigan ishlar, va ular ko'paytiriladi: ko'ylak ham kiyiladi, shim ham. Faqat bittasi tanlanadigan holatlar esa qo'shiladi: avtobusda YOKI poyezdda borish mumkin, ikkalasida birga emas. «Va» ko'paytiradi, «yoki» qo'shadi — farqni shu ikki so'z beradi.",
    'Верно. Основной закон даёт умножение, и причина проста: после КАЖДОГО выбранного пути из A в B все пути из B в C остаются открытыми. То есть каждому из m путей отвечает n продолжений — всего m умножить на n. Второй и третий пропуски разделяют два случая. Последовательные шаги — это дела, которые выполняются оба, и они перемножаются: надевается и рубашка, и брюки. А случаи, где выбирается только один вариант, складываются: доехать можно автобусом ИЛИ поездом, но не обоими сразу. «И» умножает, «или» складывает — различие дают эти два слова.',
    'Correct. The basic law gives multiplication, and the reason is simple: after EACH chosen way from A to B, all the ways from B to C remain open. So each of the m ways has n continuations — m times n in all. The second and third gaps separate two cases. Sequential steps are things that both happen, and they multiply: the shirt is worn and so are the trousers. Cases where only one option is chosen add up: you may travel by bus OR by train, not by both at once. «And» multiplies, «or» adds — those two words carry the difference.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "«m qo'shuv n» — darsning asosiy xatosi. Qo'shish faqat bitta yo'l tanlanadigan holatga tegishli, bu yerda esa YO'L IKKI BO'LAKDAN iborat: A dan B ga, keyin B dan C ga. Ikkala bo'lak ham bosib o'tiladi. Kichik misolda tekshiring: ikkita yo'l va uchta yo'l bo'lsa, hamma marshrutni sanab chiqing — oltita chiqadi, beshta emas.",
      '«m плюс n» — главная ошибка урока. Сложение относится к случаю, когда выбирается только один путь, а здесь ПУТЬ СОСТОИТ ИЗ ДВУХ ЧАСТЕЙ: от A до B, потом от B до C. Обе части проходятся. Проверь на маленьком примере: при двух и трёх путях перечисли все маршруты — выйдет шесть, а не пять.',
      '«m plus n» is the main error of the lesson. Addition belongs to the case where only one path is chosen, while here the JOURNEY HAS TWO PARTS: from A to B, then from B to C. Both parts are travelled. Check on a small example: with two ways and three ways, list all the routes — six of them, not five.') },
    { when: (s) => s.slots[1] === 'w3' || s.slots[2] === 'w2', text: L(
      "Ikki hol o'rin almashdi. Ularni bitta so'z ajratadi: ketma-ket bosqichlar «VA» bilan bog'lanadi (ko'ylak VA shim), tanlanadigan holatlar esa «YOKI» bilan (avtobus YOKI poyezd). «Va» ko'paytiradi, «yoki» qo'shadi. Gapdagi «ketma-ket» so'ziga qarang — u bosqichlar bir-biridan keyin BAJARILISHINI aytyapti, ular orasidan tanlashni emas.",
      'Два случая поменялись местами. Их различает одно слово: последовательные шаги соединяются союзом «И» (рубашка И брюки), а выбираемые случаи союзом «ИЛИ» (автобус ИЛИ поезд). «И» умножает, «или» складывает. Посмотри на слово «последовательные» в предложении — оно говорит, что шаги ВЫПОЛНЯЮТСЯ один за другим, а не что между ними выбирают.',
      'The two cases changed places. One word tells them apart: sequential steps are joined by «AND» (shirt AND trousers), while alternative cases are joined by «OR» (bus OR train). «And» multiplies, «or» adds. Look at the word «sequential» in the sentence — it says the steps are CARRIED OUT one after another, not that one chooses between them.') },
    { when: (s) => s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "«m ayirma n» va «bo'linadi» kombinatorikada umuman ishlatilmaydi. Yo'llar soni AYIRISH bilan kamaymaydi va bo'lish bilan taqsimlanmaydi: ikki bosqich birga hisoblanganda natija har doim har bosqichdan KATTA bo'ladi. Ikki va uch yo'lda ayirish bitta berardi, sanoq esa oltita marshrut ko'rsatadi.",
      '«m минус n» и «делятся» в комбинаторике не применяются вовсе. Число путей не уменьшается ВЫЧИТАНИЕМ и не распределяется делением: когда два шага считаются вместе, результат всегда БОЛЬШЕ каждого из шагов. При двух и трёх путях вычитание дало бы один, а перебор показывает шесть маршрутов.',
      '«m minus n» and «are divided» are not used in combinatorics at all. The number of ways is not reduced by SUBTRACTION nor shared out by division: when two steps are counted together, the result is always LARGER than either step. With two and three ways subtraction would give one, while enumeration shows six routes.') },
  ],
  wrongText: L(
    "«Va» ko'paytiradi, «yoki» qo'shadi. Kichik misolda sanab tekshiring: ikki va uch yo'l oltita marshrut beradi.",
    '«И» умножает, «или» складывает. Проверь перебором на маленьком примере: два и три пути дают шесть маршрутов.',
    '«And» multiplies, «or» adds. Check by enumeration on a small example: two ways and three ways give six routes.'),
};

export default function D36_05(props) { return <ClozeBank data={DATA} {...props} />; }
