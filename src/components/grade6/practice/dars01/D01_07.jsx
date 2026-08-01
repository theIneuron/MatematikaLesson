import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  type: 'choice',
  topic: { uz: "Barcha bo'luvchilar", ru: 'Практика к уроку 1. Делители и кратные' },
  prompt: {
    uz: "45 sonining barcha bo'luvchilari berilgan qatorni toping.",
    ru: 'Выберите строку, в которой перечислены все делители числа 45.',
  },
  options: [
    '1, 3, 5, 9, 15, 45',
    '1, 3, 5, 15, 45',
    '1, 5, 9, 45',
    '3, 5, 9, 15',
  ],
  answer: '1, 3, 5, 9, 15, 45',
  explanation: {
    uz: "45 ning bo'luvchilari: 1, 3, 5, 9, 15 va 45.",
    ru: 'Правильный ответ: 1, 3, 5, 9, 15, 45. Делитель делит число без остатка, а кратное получается умножением на натуральное число.',
  },
};

export default function D01_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={1} task={7}/>;
}
