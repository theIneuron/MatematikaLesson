import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Markaziy simmetriya",
    "ru": "Центральная симметрия",
    "en": "Point symmetry"
  },
  "prompt": {
    "uz": "P(−3; 4) nuqta ikki marta O markazga nisbatan akslantirildi. Natijani toping.",
    "ru": "Точку P(−3; 4) дважды отразили относительно O. Найдите результат.",
    "en": "The point P(−3; 4) was reflected about the centre O twice. Find the result."
  },
  "options": [
    "(3;−4)",
    "(−3;4)",
    "(3;4)",
    "(−4;3)"
  ],
  "answer": "(−3;4)",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, (−3;4) hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается (−3;4).",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get (−3;4)."
  }
};

export default function D41_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={41} task={10}/>;
}
