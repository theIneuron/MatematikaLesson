import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Noma'lum raqam",
    "ru": "Практика к уроку 3. Признаки делимости на 3 и 9"
  },
  "prompt": {
    "uz": "52□ soni 9 ga bo'linishi uchun katakka qaysi raqam yoziladi?",
    "ru": "Какую цифру нужно поставить вместо □ в числе 52□, чтобы оно делилось на 9?"
  },
  "options": [
    "1",
    "2",
    "4",
    "7"
  ],
  "answer": "2",
  "explanation": {
    "uz": "5 + 2 + 2 = 9. Demak, katakka 2 yoziladi.",
    "ru": "Правильный ответ: 2. Для делимости на 3 и 9 проверяют сумму цифр числа."
  }
};

export default function D03_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={3} task={7}/>;
}
