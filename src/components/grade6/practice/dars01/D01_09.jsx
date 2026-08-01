import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  type: 'match',
  topic: { uz: "Karralilarni hisoblash", ru: 'Практика к уроку 1. Делители и кратные' },
  prompt: {
    uz: "Tavsiflarni mos sonlar bilan bog'lang.",
    ru: 'Соедините описание кратного с соответствующим числом.',
  },
  left: ["5 ning 6-karralisi", "8 ning 4-karralisi", "9 ning 5-karralisi"],
  right: ['30', '32', '45'],
  pairs: [0, 1, 2],
  translationsRu: {
    '5 ning 6-karralisi': 'шестое кратное числа 5',
    '8 ning 4-karralisi': 'четвёртое кратное числа 8',
    '9 ning 5-karralisi': 'пятое кратное числа 9',
  },
  explanation: {
    uz: "5 × 6 = 30, 8 × 4 = 32 va 9 × 5 = 45.",
    ru: 'Все пары найдены правильно. Делитель делит число без остатка, а кратное получается умножением на натуральное число.',
  },
};

export default function D01_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={1} task={9}/>;
}
