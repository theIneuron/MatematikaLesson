import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Koordinata tekisligi",
    "ru": "Координатная плоскость",
    "en": "The coordinate plane"
  },
  "prompt": {
    "uz": "Qaysi nuqta y o‘qida joylashgan?",
    "ru": "Какая точка находится на оси y?",
    "en": "Which point lies on the y axis?"
  },
  "options": [
    "(3; 0)",
    "(0; −6)",
    "(4; 2)",
    "(−5; 1)"
  ],
  "answer": "(0; −6)",
  "explanation": {
    "uz": "y o‘qidagi nuqtaning x koordinatasi 0 bo‘ladi.",
    "ru": "У точки на оси y координата x равна 0.",
    "en": "A point on the y axis has the coordinate x equal to 0."
  }
};

export default function D30_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={30} task={4}/>;
}
