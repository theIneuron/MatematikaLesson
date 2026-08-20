import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Umumiy karrali",
    "ru": "Практика к уроку 1. Делители и кратные",
    "en": "A common multiple"
  },
  "prompt": {
    "uz": "4 va 6 ga bir vaqtda karrali sonni toping.",
    "ru": "Найдите число, которое одновременно кратно 4 и 6.",
    "en": "Find a number that is a multiple of 4 and of 6 at the same time."
  },
  "options": [
    "18",
    "24",
    "30",
    "42"
  ],
  "answer": "24",
  "explanation": {
    "uz": "24 soni 4 ga ham, 6 ga ham qoldiqsiz bo'linadi.",
    "ru": "Правильный ответ: 24. Делитель делит число без остатка, а кратное получается умножением на натуральное число.",
    "en": "24 divides by 4 and by 6 with no remainder."
  }
};

export default function D01_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={1} task={10}/>;
}
