// Dars04 · Amaliyot 09 — So'zlar · 🔴 · teg: simmetriya-oqi-vertikal
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
// Kontent: src/books/grade9/DARS04_AMALIYOT_KONTENT.md §09
//
// Uchala bo'shliq ham SO'Z: formula bo'shliqqa qo'yilmaydi, aks holda
// matematika til blokiga tushib qolardi. Tuzoqlar: «jadvaldan»,
// «gorizontal», «uchi».
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'simmetriya-oqi-vertikal', level: '🔴',
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L(
    "Kartani bosing, keyin bo'sh kartochkani bosing.",
    'Нажми карточку, потом пустую клетку.',
    'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  parts: [
    { text: L(
      'Uchining abssissasi topilgach, ordinatasi uni',
      'Когда абсцисса вершины найдена, ординату получают',
      'Once the abscissa of the vertex is found, the ordinate is obtained by') },
    { slot: 0 },
    { text: L(
      "hisoblanadi. Simmetriya o'qi — uchidan o'tuvchi",
      '. Ось симметрии — это',
      '. The axis of symmetry is the') },
    { slot: 1 },
    { text: L(
      'chiziq. Grafik uchi, ikki',
      'прямая через вершину. График собирают из вершины, двух',
      'line through the vertex. The graph is assembled from the vertex, two') },
    { slot: 2 },
    { text: L(
      "va uchiga nisbatan simmetrik ikki qo'shimcha nuqtadan yig'iladi.",
      'и двух дополнительных точек, симметричных относительно вершины.',
      'and two extra points symmetric about the vertex.') },
  ],
  cards: [
    { id: 'w1', label: L("formulaga qo'yib", 'подстановкой в формулу', 'substituting into the formula') },
    { id: 'w2', label: L('tik', 'вертикальная', 'vertical') },
    { id: 'w3', label: L('nol', 'нулей', 'zeros') },
    { id: 'w4', label: L('jadvaldan', 'из таблицы', 'from the table') },
    { id: 'w5', label: L('gorizontal', 'горизонтальная', 'horizontal') },
    { id: 'w6', label: L('uchi', 'вершин', 'vertices') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala so'z ham joyida. Qoida darsning uchta ishini yopadi: ordinata hisoblanadi, o'q tik, grafik esa besh nuqtadan yig'iladi. Uchtasi ham bitta zanjir: uchi topiladi, o'q undan o'tadi, qolgan nuqtalar o'qqa nisbatan joylashadi.",
    'Верно, все три слова на месте. Правило закрывает три дела урока: ординату вычисляют, ось вертикальна, график собирают из пяти точек. Все три — одна цепочка: находят вершину, через неё проходит ось, остальные точки становятся относительно оси.',
    'Correct, all three words are in place. The rule covers the three jobs of the lesson: the ordinate is computed, the axis is vertical, the graph is assembled from five points. All three form one chain: the vertex is found, the axis passes through it, the remaining points are placed relative to the axis.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Jadval qiymatlarni ko'rsatishi mumkin, lekin uchining ordinatasi undan olinmaydi: uchi jadvalda umuman bo'lmasligi mumkin. U formuladan hisoblanadi.",
      'Таблица может показать значения, но ординату вершины из неё не берут: вершины в таблице может не оказаться вовсе. Её вычисляют по формуле.',
      'A table can show values, but the ordinate of the vertex is not taken from it: the vertex may not appear in the table at all. It is computed from the formula.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Gorizontal chiziq parabolani ikki teng qismga bo'lmaydi. Grafikni bukib ko'ring: qaysi yo'nalishda ikki yarim ustma-ust tushadi?",
      'Горизонтальная прямая не делит параболу на две равные части. Согни график: в каком направлении половины совпадут?',
      'A horizontal line does not split the parabola into two equal parts. Fold the graph: in which direction do the halves match?') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Uchi allaqachon gapning boshida sanab o'tilgan. Ikkinchi marta sanashning hojati yo'q — bu yerda grafik gorizontal o'q bilan kesishgan nuqtalar so'ralyapti.",
      'Вершина уже названа в начале предложения. Считать её второй раз незачем — здесь спрашивают точки пересечения графика с горизонтальной осью.',
      'The vertex is already named at the start of the sentence. There is no point counting it twice — what is asked for here are the points where the graph crosses the horizontal axis.') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi ordinata qanday topilishini, ikkinchisi o'qning yo'nalishini, uchinchisi qanday nuqtalar kerakligini aytadi.",
    'Проверяй каждую клетку самим предложением: первое про то, как находят ординату, второе про направление оси, третье про то, какие точки нужны.',
    'Check each blank against the sentence itself: the first is about how the ordinate is found, the second about the direction of the axis, the third about which points are needed.'),
};

export default function D04_09(props) { return <ClozeBank data={DATA} {...props} />; }
