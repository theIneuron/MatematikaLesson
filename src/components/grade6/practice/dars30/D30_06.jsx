import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Koordinata tekisligi",
    "ru": "Координатная плоскость",
    "en": "The coordinate plane"
  },
  "prompt": {
    "uz": "Nuqtalarni koordinata ishoralari bilan bog‘lang.",
    "ru": "Соедините точки со знаками их координат.",
    "en": "Connect the points with the signs of their coordinates."
  },
  "left": [
    "M(−2; 9)",
    "N(7; 4)",
    "K(−6; −3)"
  ],
  "right": [
    "(−;+)",
    "(+;+)",
    "(−;−)"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Koordinatalarning ishoralari nuqtaning choragini aniqlaydi.",
    "ru": "Знаки координат определяют четверть точки.",
    "en": "The signs of the coordinates tell you the quadrant of the point."
  }
};

export default function D30_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={30} task={6}/>;
}
