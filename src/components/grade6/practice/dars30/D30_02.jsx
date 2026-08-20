import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Koordinata tekisligi",
    "ru": "Координатная плоскость",
    "en": "The coordinate plane"
  },
  "prompt": {
    "uz": "B(5; −7) nuqtaning ordinatasini yozing.",
    "ru": "Запишите ординату точки B(5; −7).",
    "en": "Write the ordinate of the point B(5; −7)."
  },
  "answer": "-7",
  "explanation": {
    "uz": "Ordinata koordinatalar juftligidagi ikkinchi son, ya’ni −7.",
    "ru": "Ордината — второе число в паре координат, то есть −7.",
    "en": "The ordinate is the second number in the pair of coordinates, that is −7."
  }
};

export default function D30_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={30} task={2}/>;
}
