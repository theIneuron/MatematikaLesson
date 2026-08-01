import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ma'lumotlar bilan ishlash",
    "ru": "Работа с данными"
  },
  "prompt": {
    "uz": "6, 8, 8, 10, 13 qatorining o‘rtacha qiymatini toping.",
    "ru": "Найдите среднее ряда 6, 8, 8, 10, 13."
  },
  "options": [
    "8",
    "9",
    "10",
    "11"
  ],
  "answer": "9",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 9 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 9."
  }
};

export default function D45_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={45} task={7}/>;
}
