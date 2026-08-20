import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Markaziy simmetriya",
    "ru": "Центральная симметрия",
    "en": "Point symmetry"
  },
  "prompt": {
    "uz": "A(4; −3) nuqtaning koordinatalar boshiga nisbatan simmetrigini toping.",
    "ru": "Найдите точку, симметричную A(4; −3) относительно начала координат.",
    "en": "Find the point symmetrical to A(4; −3) about the origin."
  },
  "options": [
    "(−4;3)",
    "(4;3)",
    "(−4;−3)",
    "(3;−4)"
  ],
  "answer": "(−4;3)",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, (−4;3) hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается (−4;3).",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get (−4;3)."
  }
};

export default function D41_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={41} task={1}/>;
}
