import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Geometriya va ma'lumotlar bo'limi yakuni",
    "ru": "Итог раздела геометрии и данных",
    "en": "Wrap-up of the geometry and data block"
  },
  "prompt": {
    "uz": "A(5; −2) nuqtaning markaziy simmetrigini toping.",
    "ru": "Найдите точку, центрально-симметричную A(5; −2).",
    "en": "Find the point symmetrical to A(5; −2) about the centre."
  },
  "options": [
    "(−5;2)",
    "(5;2)",
    "(−5;−2)",
    "(2;−5)"
  ],
  "answer": "(−5;2)",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, (−5;2) hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается (−5;2).",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get (−5;2)."
  }
};

export default function D46_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={46} task={4}/>;
}
