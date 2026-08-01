import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Raqamlar yig'indisi",
    "ru": "Практика к уроку 3. Признаки делимости на 3 и 9"
  },
  "prompt": {
    "uz": "357 sonining raqamlari yig'indisini hisoblab, javobni yozing.",
    "ru": "Вычислите сумму цифр числа 357 и запишите ответ."
  },
  "answer": "15",
  "explanation": {
    "uz": "3 + 5 + 7 = 15.",
    "ru": "Правильный ответ: 15. Для делимости на 3 и 9 проверяют сумму цифр числа."
  }
};

export default function D03_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={3} task={2}/>;
}
