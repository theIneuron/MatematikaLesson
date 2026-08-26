// Dars36 · Amaliyot 04 — Kod · 🟡 · tag: code_three_counts
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §8 (36-dars, 4-pozitsiya)
//
// UCH SAHNA, BITTA QOIDA:
//   ikki tanga tashlanadi        -> 2 · 2 = 4
//   2 shapka va 3 sharf          -> 2 · 3 = 6
//   1,2,3,4 dan takrorsiz ikki xonali son -> 4 · 3 = 12
// Uchinchisi 01 va 02-topshiriqlarning davomi: takrorlanish taqiqlangani
// uchun ikkinchi bosqichda tanlov bittaga kamayadi.
//
// Bankdagi tuzoqlar `5`, `7`, `8` — uchtasi ham QO'SHISH natijasi (З74):
// 2+3, 3+4 va 4+4.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_three_counts', level: '🟡',
  cards: ['4', '5', '6', '7', '8', '12'],
  answer: ['4', '6', '12'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch savol berilgan. Birinchisi: ikkita tanga tashlansa, nechta natija chiqadi. Ikkinchisi: ikkita shapka va uchta sharfdan nechta juftlik tuziladi. Uchinchisi: bir, ikki, uch, to'rt raqamlaridan raqamlari takrorlanmaydigan nechta ikki xonali son tuziladi.",
    'В комнате сейф, код трёхзначный. Даны три вопроса. Первый: сколько исходов, если бросить две монеты. Второй: сколько пар из двух шапок и трёх шарфов. Третий: сколько двузначных чисел без повтора цифр можно составить из цифр один, два, три, четыре.',
    'There is a safe in the room and its code has three places. Three questions are given. First: how many outcomes if two coins are tossed. Second: how many pairs from two hats and three scarves. Third: how many two-digit numbers without repeated digits can be built from the digits one, two, three, four.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch javobni kodga o'sish tartibida yozing.",
    'Запиши три ответа в код по возрастанию.',
    'Write the three answers into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Uch sahna boshqa-boshqa, qoida esa bitta: ketma-ket bosqichlar ko'paytiriladi. Birinchi tanga ikki natija beradi, ikkinchisi ham ikki — ikki karra ikki to'rt. Shapka ikkita, sharf uchta — ikki karra uch olti. Uchinchi savolda birinchi xonaga to'rtta raqam, ikkinchi xonaga esa uchtasi qoladi, chunki bittasi ishlatilgan — to'rt karra uch o'n ikki. O'sish tartibida: to'rt, olti, o'n ikki. Uchinchi sahnada bosqichlar teng emas, va shu bilan u qolgan ikkitasidan farq qiladi: takrorlanish taqiqlangani ikkinchi bosqichni bir birlikka kichraytiradi.",
    'Верно. Три сцены разные, а правило одно: последовательные шаги перемножаются. Первая монета даёт два исхода, вторая тоже два — дважды два четыре. Шапок две, шарфов три — дважды три шесть. В третьем вопросе в первый разряд идут четыре цифры, а во второй остаются три, ведь одна использована — четырежды три двенадцать. По возрастанию: четыре, шесть, двенадцать. В третьей сцене шаги неравны, и этим она отличается от двух других: запрет повтора уменьшает второй шаг на единицу.',
    'Correct. Three different scenes, one rule: sequential steps are multiplied. The first coin gives two outcomes, the second two as well — two times two is four. Two hats and three scarves — two times three is six. In the third question four digits go into the first place and three remain for the second, since one is used — four times three is twelve. In increasing order: four, six, twelve. In the third scene the steps are unequal, and that is what sets it apart: forbidding repetition shrinks the second step by one.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('5') !== -1 || s.slots.indexOf('7') !== -1 || s.slots.indexOf('8') !== -1, text: L(
      "Bu son QO'SHISH natijasi: ikki qo'shuv uch besh, uch qo'shuv to'rt yetti, to'rt qo'shuv to'rt sakkiz. Qo'shish faqat bitta narsa tanlanadigan holatlarda ishlatiladi. Bu yerda esa hamma savolda IKKI bosqich bor va ikkalasi ham bajariladi: ikki tanganing ikkalasi ham tushadi, shapka ham sharf ham kiyiladi, ikki xonali sonning ikkala xonasi ham to'ldiriladi.",
      'Это число — результат СЛОЖЕНИЯ: два плюс три пять, три плюс четыре семь, четыре плюс четыре восемь. Сложение применяется, когда выбирается только одна вещь. А здесь в каждом вопросе ДВА шага, и оба выполняются: обе монеты падают, надеваются и шапка, и шарф, заполняются оба разряда числа.',
      'This number is the result of ADDING: two plus three is five, three plus four is seven, four plus four is eight. Addition applies when only one thing is chosen. Here every question has TWO steps and both are carried out: both coins land, both hat and scarf are worn, both places of the number are filled.') },
    { when: (s) => s.slots.indexOf('12') === -1, text: L(
      "Kodda o'n ikki yo'q, lekin uchinchi savolning javobi aynan u. Birinchi xonaga to'rtta raqamdan istalganini qo'yish mumkin. Ikkinchi xonaga esa uchtasi qoladi — takrorlanish taqiqlangani uchun birinchi xonada ishlatilgan raqam chiqib ketadi. To'rt karra uch o'n ikki. Agar takrorlanishga ruxsat berilganda edi, o'n olti chiqardi.",
      'В коде нет двенадцати, а ответ третьего вопроса именно он. В первый разряд можно поставить любую из четырёх цифр. Во второй остаются три — из-за запрета повтора цифра, занятая в первом разряде, выбывает. Четырежды три двенадцать. Будь повтор разрешён, вышло бы шестнадцать.',
      'The code has no twelve, yet that is the answer to the third question. Any of the four digits may go into the first place. Three remain for the second — the ban on repetition removes the digit used in the first place. Four times three is twelve. Had repetition been allowed, the answer would be sixteen.') },
    { when: (s) => s.slots.indexOf('4') === -1, text: L(
      "Kodda to'rt yo'q, lekin ikki tanganing javobi aynan to'rt. Har tanga ikki natija beradi — o'ng tomon yoki teskari tomon, — va ikki tanga mustaqil tushadi. Hamma natijani sanab chiqish oson: birinchisida o'ng va ikkinchisida o'ng; o'ng va teskari; teskari va o'ng; teskari va teskari. To'rtta.",
      'В коде нет четвёрки, а ответ про две монеты именно четыре. Каждая монета даёт два исхода — орёл или решка, — и падают монеты независимо. Все исходы легко перебрать: орёл и орёл; орёл и решка; решка и орёл; решка и решка. Четыре.',
      'The code has no four, yet the answer about the two coins is exactly four. Each coin gives two outcomes — heads or tails — and the coins land independently. All outcomes are easy to list: heads and heads; heads and tails; tails and heads; tails and tails. Four.') },
    { when: (s) => s.set, text: L(
      "Uch javob to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: to'rt, olti, o'n ikki. Savollarning tartibi bilan javoblarning tartibi bir xil bo'lishi shart emas.",
      'Три ответа найдены верно, а порядок нарушен. Код пишется по возрастанию: четыре, шесть, двенадцать. Порядок вопросов и порядок ответов совпадать не обязаны.',
      'The three answers are right, the order is not. The code goes in increasing order: four, six, twelve. The order of the questions and the order of the answers need not agree.') },
  ],
  wrongText: L(
    "Har savolda bosqichlarni ajrating va ularni ko'paytiring. Takrorlanish taqiqlangan bo'lsa, ikkinchi bosqichda tanlov bittaga kamayadi.",
    'В каждом вопросе раздели шаги и перемножь их. Если повтор запрещён, на втором шаге выбор уменьшается на единицу.',
    'In every question separate the steps and multiply them. If repetition is forbidden, the choice at the second step shrinks by one.'),
};

export default function D36_04(props) { return <CodeLock data={DATA} {...props} />; }
