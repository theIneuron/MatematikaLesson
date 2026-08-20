import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "O'q simmetriyasi",
    "ru": "Осевая симметрия",
    "en": "Reflection symmetry"
  },
  "prompt": {
    "uz": "A(3; −2) nuqtaning y o‘qiga nisbatan aksini toping.",
    "ru": "Найдите отражение точки A(3; −2) относительно оси y.",
    "en": "Find the reflection of the point A(3; −2) in the y axis."
  },
  "options": [
    "(−3;−2)",
    "(3;2)",
    "(−3;2)",
    "(3;−2)"
  ],
  "answer": "(−3;−2)",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, (−3;−2) hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается (−3;−2).",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get (−3;−2)."
  }
};

export default function D40_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={40} task={4}/>;
}
