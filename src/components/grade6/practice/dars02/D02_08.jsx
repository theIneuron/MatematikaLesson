import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Katakdagi raqam",
    "ru": "Практика к уроку 2. Признаки делимости на 2, 5 и 10",
    "en": "The digit in the box"
  },
  "prompt": {
    "uz": "481□ soni 10 ga bo'linishi uchun katakka yoziladigan raqamni kiriting.",
    "ru": "Какую цифру нужно поставить вместо □ в числе 481□, чтобы оно делилось на 10?",
    "en": "Enter the digit that goes in the box so that 481□ divides by 10."
  },
  "answer": "0",
  "explanation": {
    "uz": "10 ga bo'linadigan sonning oxirgi raqami 0 bo'lishi kerak.",
    "ru": "Правильный ответ: 0. Для делимости на 2, 5 и 10 достаточно проверить последнюю цифру.",
    "en": "A number that divides by 10 has to end in 0."
  }
};

export default function D02_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={2} task={8}/>;
}
