import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Murakkab modulli tenglama",
    "ru": "Практика к уроку 25. Модуль числа"
  },
  "prompt": {
    "uz": "|x − 3| = 5 tenglamaning ikkala yechimi qaysi qatorda to'g'ri berilganini toping.",
    "ru": "Найдите оба решения уравнения |x − 3| = 5."
  },
  "options": [
    "x = −8 va x = 2",
    "x = −2 va x = 8",
    "x = 2 va x = 8",
    "x = −5 va x = 5"
  ],
  "answer": "x = −2 va x = 8",
  "translationsRu": {
    "x = −8 va x = 2": "x = −8 и x = 2",
    "x = −2 va x = 8": "x = −2 и x = 8",
    "x = 2 va x = 8": "x = 2 и x = 8",
    "x = −5 va x = 5": "x = −5 и x = 5"
  },
  "explanation": {
    "uz": "x − 3 = 5 yoki x − 3 = −5; bundan x = 8 yoki x = −2.",
    "ru": "Правильный ответ: x = −2 и x = 8. Модуль числа — его расстояние от нуля, поэтому модуль не бывает отрицательным."
  }
};

export default function D25_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={25} task={10}/>;
}
