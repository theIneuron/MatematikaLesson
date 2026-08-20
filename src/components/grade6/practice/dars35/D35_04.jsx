import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Tenglama yordamida masalalar yechish",
    "ru": "Решение задач с помощью уравнений",
    "en": "Solving problems with equations"
  },
  "prompt": {
    "uz": "Ikki ketma-ket natural son yig‘indisi 41. Kichik sonni toping.",
    "ru": "Сумма двух последовательных натуральных чисел равна 41. Найдите меньшее.",
    "en": "The sum of two natural numbers that follow one another is 41. Find the smaller number."
  },
  "options": [
    "18",
    "19",
    "20",
    "21"
  ],
  "answer": "20",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 20 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 20.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 20."
  }
};

export default function D35_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={35} task={4}/>;
}
