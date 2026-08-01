import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Katakdagi raqam",
    "ru": "Практика к уроку 3. Признаки делимости на 3 и 9"
  },
  "prompt": {
    "uz": "47□ soni 9 ga bo'linishi uchun katakka yoziladigan raqamni kiriting.",
    "ru": "Запишите цифру вместо □ в числе 47□, чтобы оно делилось на 9."
  },
  "answer": "7",
  "explanation": {
    "uz": "4 + 7 + 7 = 18; 18 soni 9 ga bo'linadi.",
    "ru": "Правильный ответ: 7. Для делимости на 3 и 9 проверяют сумму цифр числа."
  }
};

export default function D03_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={3} task={8}/>;
}
