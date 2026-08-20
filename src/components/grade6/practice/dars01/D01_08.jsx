import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Karralini hisoblash",
    "ru": "Практика к уроку 1. Делители и кратные",
    "en": "Working out a multiple"
  },
  "prompt": {
    "uz": "11 sonining sakkizinchi karralisini hisoblang va javobni yozing.",
    "ru": "Вычислите восьмое кратное числа 11 и запишите ответ.",
    "en": "Work out the eighth multiple of 11 and write the answer."
  },
  "answer": "88",
  "explanation": {
    "uz": "11 ning sakkizinchi karralisi 11 × 8 = 88.",
    "ru": "Правильный ответ: 88. Делитель делит число без остатка, а кратное получается умножением на натуральное число.",
    "en": "The eighth multiple of 11 is 11 × 8 = 88."
  }
};

export default function D01_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={1} task={8}/>;
}
