import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Modulli tenglama",
    "ru": "Практика к уроку 25. Модуль числа",
    "en": "An equation with a modulus"
  },
  "prompt": {
    "uz": "|x| = 9 tenglamaning musbat yechimini yozing.",
    "ru": "Запишите положительное решение уравнения |x| = 9.",
    "en": "Write the positive solution of the equation |x| = 9."
  },
  "answer": "9",
  "explanation": {
    "uz": "|x| = 9 tenglamaning musbat yechimi 9.",
    "ru": "Правильный ответ: 9. Модуль числа — его расстояние от нуля, поэтому модуль не бывает отрицательным.",
    "en": "The positive solution of the equation |x| = 9 is 9."
  }
};

export default function D25_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={25} task={2}/>;
}
