import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Markaziy simmetriya",
    "ru": "Центральная симметрия"
  },
  "prompt": {
    "uz": "A(1; 5) va A′(−1; −5) kesmasining o‘rta nuqtasini toping.",
    "ru": "Найдите середину отрезка AA′ для A(1; 5), A′(−1; −5)."
  },
  "options": [
    "(0;0)",
    "(1;0)",
    "(0;5)",
    "(−1;0)"
  ],
  "answer": "(0;0)",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, (0;0) hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается (0;0)."
  }
};

export default function D41_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={41} task={7}/>;
}
