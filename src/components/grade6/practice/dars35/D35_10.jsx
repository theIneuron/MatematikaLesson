import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Tenglama yordamida masalalar yechish",
    "ru": "Решение задач с помощью уравнений"
  },
  "prompt": {
    "uz": "To‘g‘ri to‘rtburchak eni x, bo‘yi x+5, perimetri 46. Enini toping.",
    "ru": "Ширина прямоугольника x, длина x+5, периметр 46. Найдите ширину."
  },
  "options": [
    "8",
    "9",
    "11",
    "14"
  ],
  "answer": "9",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 9 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 9."
  }
};

export default function D35_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={35} task={10}/>;
}
