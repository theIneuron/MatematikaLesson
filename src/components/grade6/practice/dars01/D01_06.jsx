import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  type: 'match',
  topic: { uz: "Son va bo'luvchi", ru: 'Практика к уроку 1. Делители и кратные' },
  prompt: {
    uz: "Har bir sonni mos bo'luvchisi bilan bog'lang.",
    ru: 'Соедините каждое число с подходящим делителем.',
  },
  left: ['24', '35', '42'],
  right: ['6', '7', '8'],
  pairs: [2, 1, 0],
  explanation: {
    uz: "24 : 8 = 3, 35 : 7 = 5 va 42 : 6 = 7.",
    ru: 'Все пары найдены правильно. Делитель делит число без остатка, а кратное получается умножением на натуральное число.',
  },
};

export default function D01_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={1} task={6}/>;
}
