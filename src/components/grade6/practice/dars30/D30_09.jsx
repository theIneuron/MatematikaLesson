import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Koordinata tekisligi",
    "ru": "Координатная плоскость",
    "en": "The coordinate plane"
  },
  "prompt": {
    "uz": "Siljishlarni yangi nuqtalar bilan moslashtiring.",
    "ru": "Соедините перемещения с новыми точками.",
    "en": "Match the moves with the new points."
  },
  "left": [
    "(1;2) dan 3 o‘ngga",
    "(−2;4) dan 5 pastga",
    "(3;−1) dan 2 chapga"
  ],
  "right": [
    "(4;2)",
    "(−2;−1)",
    "(1;−1)"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "(1;2) dan 3 o‘ngga": "из (1;2) на 3 вправо",
    "(−2;4) dan 5 pastga": "из (−2;4) на 5 вниз",
    "(3;−1) dan 2 chapga": "из (3;−1) на 2 влево"
  },
  "translationsEn": {
    "(1;2) dan 3 o‘ngga": "3 to the right from (1;2)",
    "(−2;4) dan 5 pastga": "5 down from (−2;4)",
    "(3;−1) dan 2 chapga": "2 to the left from (3;−1)"
  },
  "explanation": {
    "uz": "Gorizontal siljish x ni, vertikal siljish y ni o‘zgartiradi.",
    "ru": "Горизонтальное перемещение меняет x, вертикальное — y.",
    "en": "A horizontal move changes x and a vertical move changes y."
  }
};

export default function D30_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={30} task={9}/>;
}
