import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Harfli ifodalar",
    "ru": "Буквенные выражения",
    "en": "Expressions with letters"
  },
  "prompt": {
    "uz": "x = 5, y = 2 bo‘lganda 2x + 3y ni toping.",
    "ru": "При x = 5 и y = 2 найдите 2x + 3y.",
    "en": "Find 2x + 3y when x = 5 and y = 2."
  },
  "options": [
    "11",
    "13",
    "16",
    "20"
  ],
  "answer": "16",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 16 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 16.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 16."
  }
};

export default function D31_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={31} task={10}/>;
}
