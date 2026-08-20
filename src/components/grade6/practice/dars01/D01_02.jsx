import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Bo'luvchilar soni",
    "ru": "Практика к уроку 1. Делители и кратные",
    "en": "How many divisors"
  },
  "prompt": {
    "uz": "64 sonining natural bo'luvchilari nechta? Javobni raqam bilan yozing.",
    "ru": "Сколько натуральных делителей имеет число 64? Запишите ответ цифрой.",
    "en": "How many natural divisors does 64 have? Write the answer as a numeral."
  },
  "answer": "7",
  "explanation": {
    "uz": "64 = 2⁶. Uning bo'luvchilari 1, 2, 4, 8, 16, 32 va 64 — jami 7 ta.",
    "ru": "Правильный ответ: 7. Делитель делит число без остатка, а кратное получается умножением на натуральное число.",
    "en": "64 = 2⁶. Its divisors are 1, 2, 4, 8, 16, 32 and 64 — seven in all."
  }
};

export default function D01_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={1} task={2}/>;
}
