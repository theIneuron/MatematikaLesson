import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  type: 'input',
  topic: { uz: "Bo'luvchilar soni", ru: 'Практика к уроку 1. Делители и кратные' },
  prompt: {
    uz: "64 sonining natural bo'luvchilari nechta? Javobni raqam bilan yozing.",
    ru: 'Сколько натуральных делителей имеет число 64? Запишите ответ цифрой.',
  },
  answer: '7',
  explanation: {
    uz: "64 = 2⁶. Uning bo'luvchilari 1, 2, 4, 8, 16, 32 va 64 — jami 7 ta.",
    ru: 'Правильный ответ: 7. Делитель делит число без остатка, а кратное получается умножением на натуральное число.',
  },
};

export default function D01_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={1} task={2}/>;
}
