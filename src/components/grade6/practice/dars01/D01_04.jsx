import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  type: 'choice',
  topic: { uz: "Karrali sonni topish", ru: 'Практика к уроку 1. Делители и кратные' },
  prompt: { uz: "7 ga karrali sonni toping.", ru: 'Найдите число, кратное 7.' },
  options: ['32', '35', '38', '41'],
  answer: '35',
  explanation: {
    uz: "35 = 7 × 5. Demak, 35 soni 7 ga karrali.",
    ru: 'Правильный ответ: 35. Делитель делит число без остатка, а кратное получается умножением на натуральное число.',
  },
};

export default function D01_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={1} task={4}/>;
}
