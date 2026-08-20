import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ma'lumotlar bilan ishlash",
    "ru": "Работа с данными",
    "en": "Working with data"
  },
  "prompt": {
    "uz": "5, 7, 9, 11 qatorining o‘rtacha arifmetigini toping.",
    "ru": "Найдите среднее арифметическое ряда 5, 7, 9, 11.",
    "en": "Find the mean of the list 5, 7, 9, 11."
  },
  "options": [
    "7",
    "8",
    "9",
    "10"
  ],
  "answer": "8",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 8 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 8.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 8."
  }
};

export default function D45_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={45} task={4}/>;
}
