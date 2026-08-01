import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Tenglama yordamida masalalar yechish",
    "ru": "Решение задач с помощью уравнений"
  },
  "prompt": {
    "uz": "Ikki ketma-ket natural son yig‘indisi 41. Kichik sonni toping.",
    "ru": "Сумма двух последовательных натуральных чисел равна 41. Найдите меньшее."
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
    "ru": "После последовательного применения правила темы к данным условия получается 20."
  }
};

export default function D35_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={35} task={4}/>;
}
