import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ma'lumotlar bilan ishlash",
    "ru": "Работа с данными",
    "en": "Working with data"
  },
  "prompt": {
    "uz": "2, 4, 4, 5, 7 qatorining modasini toping.",
    "ru": "Найдите моду ряда 2, 4, 4, 5, 7.",
    "en": "Find the mode of the list 2, 4, 4, 5, 7."
  },
  "options": [
    "2",
    "4",
    "5",
    "7"
  ],
  "answer": "4",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 4 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 4.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 4."
  }
};

export default function D45_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={45} task={1}/>;
}
