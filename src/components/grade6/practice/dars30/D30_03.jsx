import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Koordinata tekisligi",
    "ru": "Координатная плоскость"
  },
  "prompt": {
    "uz": "Nuqtalarni ular joylashgan chorak bilan moslashtiring.",
    "ru": "Соедините точки с четвертями, в которых они находятся."
  },
  "left": [
    "P(2; 6)",
    "Q(−3; −5)",
    "R(4; −1)"
  ],
  "right": [
    "I",
    "III",
    "IV"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "I: (+;+), III: (−;−), IV: (+;−).",
    "ru": "I: (+;+), III: (−;−), IV: (+;−)."
  }
};

export default function D30_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={30} task={3}/>;
}
