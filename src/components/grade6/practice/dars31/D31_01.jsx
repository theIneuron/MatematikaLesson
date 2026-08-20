import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Harfli ifodalar",
    "ru": "Буквенные выражения",
    "en": "Expressions with letters"
  },
  "prompt": {
    "uz": "x = 4 bo‘lganda 3x + 7 ifodaning qiymatini toping.",
    "ru": "При x = 4 найдите значение 3x + 7.",
    "en": "Find the value of the expression 3x + 7 when x = 4."
  },
  "options": [
    "12",
    "19",
    "21",
    "28"
  ],
  "answer": "19",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 19 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 19.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 19."
  }
};

export default function D31_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={31} task={1}/>;
}
